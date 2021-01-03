import { GetStaticProps } from 'next';
import Link from 'next/link';
import { Container } from '../components/container';
import Layout from '../components/layout';
import { More } from '../components/more';
import { PostList } from '../components/post-list';
import { ProjectList } from '../components/project-list';
import { build } from '../lib/build';
import { IPost, IProject, IWork, posts, projects, work } from '../lib/static-content';
import { classes } from '../lib/ui';
import styles from './index.module.scss';

interface IProps {
  projects: IProject[];
  posts: IPost[];
  work: IWork[];
}

const Home: React.FC<IProps> = ({ projects, posts, work }) => {
  return (
    <Layout>
      <Container>
        <div className={styles.intro}>
          <img src="/images/profile.jpg" alt="Profile Picture" />
          <div style={{ flexGrow: 1 }}>
            <p>
              Hi, I'm Connor. I'm a software engineer working on{' '}
              <a href="https://code.visualstudio.com/">VS Code</a> at Microsoft. I build{' '}
              <Link href="/oss">neat things</Link> and{' '}
              <Link href="/blog">sometimes write about them</Link>.
            </p>
            <ul className={styles.social}>
              <li>
                <a href="https://git.io/8">GitHub</a>
              </li>
              <li>
                <a href="https://twitter.com/ConnorPeet">Twitter</a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/connorpeet/">Linkedin</a>
              </li>
            </ul>
          </div>
        </div>
        <div className={classes('long-form', styles.content)}>
          <h1>Work</h1>
          <ul>
            {work.map((w) => (
              <li key={w.id}>
                <Link href={`/work/${w.id}`}>
                  <a>{w.name}</a>
                </Link>{' '}
                {w.fromYear} - {w.toYear || 'Present'}
              </li>
            ))}
          </ul>
          <h1>Projects</h1>
          <ProjectList projects={projects.slice(0, 6)} />
          <More href="/oss" />

          <h1>Recent Posts</h1>
          <PostList posts={posts.slice(0, 3)} more={false} />
          <More href="/blog" />
        </div>
      </Container>
    </Layout>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<IProps> = async () => {
  // use this to run our build scripts... this is a bit of a hack, but next.js
  // doesn't seem to have a better way to run typescript scripts at build time.
  await build();

  return {
    props: {
      projects: await projects.provideSummaries(),
      posts: await posts.provideSummaries(),
      work: await work.provideSummaries(),
    },
  };
};
