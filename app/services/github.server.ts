import { Octokit } from "octokit";
import { type User } from "~/services/session.server";

export const getMyIssues = async (user: User) => {
  const octokit = new Octokit({
    auth: `token ${user.accessToken}`,
  });

  return await octokit.request("GET /user/issues", {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
};

export const getUser = async (user: User) => {
  const octokit = new Octokit({
    auth: `token ${user.accessToken}`,
  });

  return await octokit.request("GET /user", {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
};

export const getMyStarred = async (user: User) => {
  const octokit = new Octokit({
    auth: `token ${user.accessToken}`,
  });

  return await octokit.request("GET /user/starred", {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
};

export const getOwnerDetails = async (user: User, owner: string) => {
  const octokit = new Octokit({
    auth: `token ${user.accessToken}`,
  });

  return await octokit.request("GET /users/{owner}", {
    owner,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
};

export const getRepoIssues = async ({
  user,
  owner,
  repo,
}: {
  user: User;
  owner: string;
  repo: string;
}) => {
  const octokit = new Octokit({
    auth: `token ${user.accessToken}`,
  });

  return await octokit.request(`GET /repos/{owner}/{repo}/issues`, {
    owner,
    repo,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
};

export const getRepoIssue = async ({
  user,
  owner,
  number,
  repo,
}: {
  user: User;
  owner: string;
  number: string;
  repo: string;
}) => {
  const octokit = new Octokit({
    auth: `token ${user.accessToken}`,
  });

  return await octokit.request(`GET /repos/{owner}/{repo}/issues/{number}`, {
    owner,
    repo,
    number,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
};

export const getOrgRepos = async ({
  user,
  owner,
}: {
  user: User;
  owner: string;
}) => {
  const octokit = new Octokit({
    auth: `token ${user.accessToken}`,
  });

  return await octokit.request("GET /orgs/{org}/repos", {
    org: owner,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
};

export const getIssueComments = async ({
  user,
  owner,
  repo,
  number,
}: {
  user: User;
  owner: string;
  repo: string;
  number: string;
}) => {
  const octokit = new Octokit({
    auth: `token ${user.accessToken}`,
  });

  return await octokit.request(
    "GET /repos/{owner}/{repo}/issues/{number}/comments",
    {
      owner,
      repo,
      number,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
};

export const getUserRepos = async ({
  user,
  owner,
}: {
  user: User;
  owner: string;
}) => {
  const octokit = new Octokit({
    auth: `token ${user.accessToken}`,
  });

  return await octokit.request("GET /users/{user}/repos", {
    user: owner,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
};

export const createRepoIssue = async ({
  user,
  owner,
  repo,
  title,
  description,
}: {
  user: User;
  owner: string;
  repo: string;
  title: string;
  description: string;
}) => {
  const octokit = new Octokit({
    auth: `token ${user.accessToken}`,
  });

  return await octokit.request("POST /repos/{owner}/{repo}/issues", {
    owner,
    repo,
    title,
    body: description,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
};
