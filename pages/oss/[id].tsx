import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import { ProjectLayout } from '../../components/project-layout';
import { IProjectWithContent, projects } from '../../lib/static-content';

interface IProps {
  project: IProjectWithContent;
}

export default function Post({ project }: IProps) {
  return (
    <ProjectLayout project={project} repo={project.repo}>
      <div className="long-form" dangerouslySetInnerHTML={{ __html: project.content }} />
    </ProjectLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: await projects.provideRouteIds(),
  fallback: false,
});

export const getStaticProps: GetStaticProps<IProps, { id: string }> = async ({ params }) => ({
  props: {
    project: await projects.provideFullData(params!.id),
  },
});
