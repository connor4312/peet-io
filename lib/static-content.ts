import { promises as fs } from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { getProjectRepo, Repository } from './get-repo';
import { languageColors } from './language-colors';
import { getFirstMd, makeProcessor } from './md-engine';
import { once } from './ui';

const mdExtension = '.md';

interface IStaticFile {
  name: string;
  noext: string;
  path: string;
}
interface IFileWithFrontMatter {
  file: IStaticFile;
  frontmatter: matter.GrayMatterFile<string>;
}

abstract class StaticContentProvider<TSummarized extends { id: string }, TFull> {
  protected readonly directory: string;

  constructor(directory: string) {
    this.directory = path.join(process.cwd(), 'pages', directory);
  }

  /**
   * Provides route params sets for all the content.
   */
  public async provideRouteIds(paramName = 'id') {
    return (await this.provideSummaries()).map((s) => ({ params: { [paramName]: s.id } }));
  }

  /**
   * Gets all summaries for the data type.
   */
  public abstract provideSummaries(): Promise<TSummarized[]>;

  /**
   * Gets the complete resource data for the given ID.
   */
  public abstract provideFullData(resourceId: string): Promise<TFull>;

  /**
   * Gets all files and their frontmatter.
   */
  protected readonly getAllFrontmatter = once(async () => {
    const files = await this.getAllFiles();
    return await Promise.all(
      files.map(
        async (file): Promise<IFileWithFrontMatter> => ({
          file,
          frontmatter: await this.getFrontmatter(file.name),
        }),
      ),
    );
  });

  /**
   * Gets all markdown files for the directory.
   */
  protected readonly getAllFiles = once(async () => {
    const fileNames = await fs.readdir(this.directory);
    return fileNames
      .filter((f) => f.endsWith(mdExtension))
      .map(
        (filename): IStaticFile => ({
          name: filename,
          noext: filename.slice(0, -mdExtension.length),
          path: path.join(this.directory, filename),
        }),
      );
  });

  /**
   * Gets frontmatter for a specific file.
   */
  protected async getFrontmatter(file: string) {
    if (!file.endsWith(mdExtension)) {
      file += mdExtension;
    }

    const fullPath = path.join(this.directory, file);
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const frontmatter = matter(fileContents);
    return frontmatter;
  }
}

export interface IPost {
  id: string;
  date: string;
  title: string;
  firstParagraph: string;
  imageUrl: string | null;
  scripts?: ReadonlyArray<string | Record<string, string>>;
}

export interface IPostWithContent extends IPost {
  contentHtml: string;
}
class BlogContentProvider extends StaticContentProvider<IPost, IPostWithContent> {
  public async provideSummaries() {
    const files = await this.getAllFrontmatter();
    const summaries = await Promise.all(
      files.map(async ({ file, frontmatter }) => this.getPost(file.noext, frontmatter)),
    );

    return summaries.sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  public async provideFullData(id: string) {
    const frontmatter = await this.getFrontmatter(id);
    const processedContent = await makeProcessor().process(frontmatter.content);
    const contentHtml = processedContent.toString();
    return { ...(await this.getPost(id, frontmatter)), contentHtml };
  }

  private async getPost(id: string, frontmatter: matter.GrayMatterFile<string>) {
    const firstParagraph = await makeProcessor()
      .use(() => (root) => {
        const node = getFirstMd(root, (n) => n.tagName === 'p');
        root.children = node ? [node] : [];
      })
      .process(frontmatter.content);

    let imageUrl: string | null = null;
    await makeProcessor()
      .use(() => (root: any) => {
        const node = getFirstMd(root, (n) => n.tagName === 'img');
        imageUrl = (node?.properties as { [key: string]: string })?.src ?? null;
      })
      .process(frontmatter.content);

    return {
      id,
      firstParagraph: firstParagraph.toString(),
      imageUrl,
      ...frontmatter.data,
    } as IPost;
  }
}

export const posts = new BlogContentProvider('blog');

export interface IProject {
  name: string;
  summary: string;
  lang: ReadonlyArray<keyof typeof languageColors>;
  ghOwner: string;
  ghRepo: string;
  id: string;
  sort: number;
}

export interface IProjectWithContent extends IProject {
  content: string;
  repo: Repository;
}

const projectSortOrder = ['etcd3', 'js-debug', 'cockatiel', 'redplex'];

class ProjectContentProvider extends StaticContentProvider<IProject, IProjectWithContent> {
  public async provideSummaries() {
    const files = await this.getAllFrontmatter();
    const summaries = files.map((f) =>
      this.resolveProjectFromFrontmatter(f.file.noext, f.frontmatter),
    );

    return summaries.sort((a, b) => a.sort - b.sort);
  }

  public async provideFullData(id: string) {
    const frontmatter = await this.getFrontmatter(id);
    const project = this.resolveProjectFromFrontmatter(id, frontmatter);

    const processedContent = await makeProcessor().process(frontmatter.content);
    return {
      content: processedContent.toString(),
      repo: await getProjectRepo(project),
      ...project,
    } as IProjectWithContent;
  }

  private resolveProjectFromFrontmatter(noext: string, frontmatter: matter.GrayMatterFile<string>) {
    const project = {
      id: noext,
      ghOwner: 'connor4312',
      ghRepo: frontmatter.data.id ?? noext,
      ...frontmatter.data,
    } as IProject;

    project.sort = projectSortOrder.includes(project.id)
      ? projectSortOrder.indexOf(project.id)
      : Infinity;

    return project;
  }
}

export const projects = new ProjectContentProvider('oss');

export interface IWork {
  id: string;
  name: string;
  next: { id: string; name: string } | null;
  prev: { id: string; name: string } | null;
  fromYear: number;
  toYear?: number;
}

export interface IWorkWithContent extends IWork {
  content: string;
}

const toWorkRef = (work: IWork | undefined) => (work ? { id: work.id, name: work.name } : null);

class WorkContentProvider extends StaticContentProvider<IWork, IWorkWithContent> {
  public async provideSummaries() {
    const files = await this.getAllFrontmatter();
    const summaries = files.map(
      ({ file, frontmatter }) =>
        ({
          id: file.noext,
          ...frontmatter.data,
        } as IWork),
    );

    summaries.sort((a, b) => (b.toYear || Infinity) - (a.toYear || Infinity));

    for (let i = 0; i < summaries.length; i++) {
      summaries[i].prev = toWorkRef(summaries[i + 1]);
      summaries[i].next = toWorkRef(summaries[i - 1]);
    }

    return summaries;
  }

  public async provideFullData(id: string) {
    const frontmatter = await this.getFrontmatter(id);
    const processedContent = await makeProcessor().process(frontmatter.content);
    const content = processedContent.toString();
    const summary = (await this.provideSummaries()).find((w) => w.id === id);
    return { content, ...summary } as IWorkWithContent;
  }
}

export const work = new WorkContentProvider('work');
