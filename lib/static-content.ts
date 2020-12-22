import { promises as fs } from 'fs';
import matter from 'gray-matter';
import path from 'path';
import remark from 'remark';
import html from 'remark-html';
import { getProjectRepo, Repository } from './get-repo';
import { languageColors } from './language-colors';
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
        async (file): Promise<IFileWithFrontMatter> => {
          const fileContents = await fs.readFile(file.path, 'utf8');
          return { file, frontmatter: matter(fileContents) };
        },
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
}

export interface IPost {
  id: string;
  date: string;
  title: string;
}

export interface IPostWithContent extends IPost {
  contentHtml: string;
}

class PostContentProvider extends StaticContentProvider<IPost, IPostWithContent> {
  public async provideSummaries() {
    const files = await this.getAllFrontmatter();
    const summaries = files.map(
      ({ file, frontmatter }) => ({ id: file.noext, ...frontmatter.data } as IPost),
    );

    return summaries.sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  public async provideFullData(id: string) {
    const fullPath = path.join(this.directory, `${id}.md`);
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    const processedContent = await remark().use(html).process(matterResult.content);
    const contentHtml = processedContent.toString();
    return { id, contentHtml, ...matterResult.data } as IPostWithContent;
  }
}

export const posts = new PostContentProvider('posts');

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
    const fullPath = path.join(this.directory, `${id}.md`);
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const frontmatter = matter(fileContents);
    const project = this.resolveProjectFromFrontmatter(id, frontmatter);

    const processedContent = await remark().use(html).process(frontmatter.content);
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
