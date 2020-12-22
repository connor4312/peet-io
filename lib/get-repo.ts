import { Octokit } from '@octokit/rest';
import { IProject } from './static-content';
import { memoize } from './ui';

const octokit = new Octokit({
  auth: process.env.OCTOKIT_PAT,
});

export const getProjectRepo = (project: IProject) =>
  getRepoInfo(project.ghOwner ?? 'connor4312', project.ghRepo ?? project.id ?? project.name);

export const getRepoInfo = memoize(
  (owner: string, repo: string) => octokit.repos.get({ owner, repo }),
  (owner, repo) => `${owner}/${repo}`,
);

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

export type Repository = ThenArg<ReturnType<typeof getRepoInfo>>;
