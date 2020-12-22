import { GetStaticProps } from 'next';
import React from 'react';
import { Container } from '../../components/container';
import Layout from '../../components/layout';
import { ProjectList } from '../../components/project-list';
import { IProject, projects } from '../../lib/static-content';

interface IProps {
  projects: IProject[];
}

const Projects: React.FC<IProps> = ({ projects }) => {
  return (
    <Layout>
      <Container>
        <h1>OSS</h1>
        A selection open source projects which I think are useful or interesting. In no particular order.
        <ProjectList projects={projects} />
      </Container>
    </Layout>
  );
};

export default Projects;

export const getStaticProps: GetStaticProps<IProps> = async () => ({
  props: {
    projects: await projects.provideSummaries(),
  },
});
