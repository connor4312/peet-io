import Link from 'next/link';
import React from 'react';
import { IProject } from '../lib/static-content';
import styles from './project-list.module.scss';

export const ProjectList: React.FC<{ projects: ReadonlyArray<IProject> }> = ({ projects }) => (
  <div className={styles.container}>
    {projects.map((p, i) => (
      <ProjectCard key={i} project={p} />
    ))}
  </div>
);

export const ProjectCard: React.FC<{ project: IProject }> = ({ project }) => (
  <Link href={`/oss/${project.id ?? project.name}`}>
    <a className={styles.card}>
      <strong>{project.name}</strong>
      <p>{project.summary}</p>
    </a>
  </Link>
);
