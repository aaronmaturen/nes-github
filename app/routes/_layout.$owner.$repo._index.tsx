import { type LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData, Form } from "@remix-run/react";
import {
  getRepoDetails,
  getRepoIssues,
  starRepo,
  unstarRepo,
  isStarred,
} from "~/services/github.server";
import { Markdown } from "~/components/markdown";
import { parseMarkdown } from "~/services/markdown.server";

import { authenticator } from "~/services/auth.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  // const issues = await getMyIssues(user);

  const issues = await getRepoIssues({
    user: user,
    owner: params.owner!,
    repo: params.repo!,
  });

  const details = await getRepoDetails({
    user: user,
    owner: params.owner!,
    repo: params.repo!,
  });

  const starred = await isStarred({
    user: user,
    owner: params.owner!,
    repo: params.repo!,
  });

  return json({
    user,
    owner: params.owner,
    repo: params.repo,
    stars: details.data.stargazers_count,
    starred,
    issues: issues.data.map((issue: any) => {
      return {
        id: issue.id,
        title: issue.title,
        body: parseMarkdown(issue.body),
        number: issue.number,
        pull_request: Boolean(issue.pull_request),
        state: issue.state,
      };
    }),
  });
};

export const action = async ({ request, params }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const body = await request.formData();

  if (body.get("action") === "star") {
    await starRepo({
      user: user,
      owner: params.owner!,
      repo: params.repo!,
    });
  }
  if (body.get("action") === "unstar") {
    await unstarRepo({
      user: user,
      owner: params.owner!,
      repo: params.repo!,
    });
  }

  return redirect(`/${params.owner}/${params.repo}`);
};

export default function Screen() {
  const { issues, owner, repo, stars, starred } =
    useLoaderData<typeof loader>();

  return (
    <>
      <div>
        <Link to={`/${owner}`}>{owner}</Link> / {repo}{" "}
        <Link className="nes-btn" to={`/${owner}/${repo}/new`}>
          New Issue
        </Link>
      </div>
      <div>
        <Form method="post">
          <button
            type="submit"
            name="action"
            value={starred ? "unstar" : "star"}
            className="nes-badge is-splited"
          >
            <span className="is-dark">
              <i
                className={`nes-icon star is-small ${
                  starred ? "" : "is-empty"
                }`}
              ></i>
            </span>
            <span className="is-primary">{stars}</span>
          </button>
        </Form>
      </div>

      <div className="flex flex-col gap-4">
        {issues.length === 0 && (
          <div className="nes-container with-title">no issues</div>
        )}
        {issues.map((issue: any) => (
          <div key={issue.id} className="nes-container with-title">
            <Link className="title" to={`/${owner}/${repo}/${issue.number}`}>
              {issue.number} {issue.title}
            </Link>
            <div>
              {issue.pull_request ? (
                <>
                  <span className="nes-badge is-splited">
                    <span className="is-dark">PR</span>
                    <span
                      className={
                        issue.state === "open" ? "is-success" : "is-error"
                      }
                    >
                      {issue.state}
                    </span>
                  </span>
                </>
              ) : (
                <>
                  <span className="nes-badge is-splited">
                    <span className="is-dark">ISSUE</span>
                    <span
                      className={
                        issue.state === "open" ? "is-success" : "is-error"
                      }
                    >
                      {issue.state}
                    </span>
                  </span>
                </>
              )}
            </div>
            <Markdown content={issue.body} />
          </div>
        ))}
      </div>
    </>
  );
}
