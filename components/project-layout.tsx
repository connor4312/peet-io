import { Repository } from '../lib/get-repo';
import { languageColors } from '../lib/language-colors';
import { IProject } from '../lib/static-content';
import { Container } from './container';
import Layout from './layout';
import styles from './project-layout.module.scss';

export const ProjectLayout: React.FC<{ project: IProject; repo: Repository }> = ({
  project,
  repo,
  children,
}) => (
  <Layout title={project.name}>
    <Container>
      <h1>{project.name}</h1>
      <div className={styles.meta}>
        <span>
          <a href={repo.data.html_url}>Source</a>
        </span>
        <span>{repo.data.stargazers_count} Stars</span>
        <span>{repo.data.license?.name ?? 'No License'}</span>
        {project.lang.map((l) => (
          <span key={l} className={styles.lang}>
            <span style={{ backgroundColor: languageColors[l].color || '#666' }} />
            {l}
          </span>
        ))}
      </div>
      {children}
    </Container>
  </Layout>
);
