import { GetStaticProps } from 'next';
import Link from 'next/link';
import { Container } from '../components/container';
import Layout from '../components/layout';
import { More } from '../components/more';
import { ProjectList } from '../components/project-list';
import { IProject, projects } from '../lib/static-content';
import styles from './index.module.scss';

interface IProps {
  projects: IProject[];
}

const Home: React.FC<IProps> = ({ projects }) => {
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
              <Link href="/posts">sometimes write about them</Link>.
            </p>
            <ul className={styles.social}>
              <li>
                <a href="https://git.io/8">Github</a>
              </li>
              <li>
                <a href="https://twitter.com">Twitter</a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/connorpeet/">Linkedin</a>
              </li>
            </ul>
          </div>
        </div>
        <h1 style={{ marginTop: '3rem' }}>Projects</h1>
        <ProjectList projects={projects.slice(0, 6)} />
        <More href="/oss" />
      </Container>
    </Layout>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<IProps> = async () => ({
  props: {
    projects: await projects.provideSummaries(),
  },
});
