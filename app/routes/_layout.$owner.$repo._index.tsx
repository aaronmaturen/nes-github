import { type LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getRepoIssues } from "~/services/github.server";
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

  return json({
    user,
    owner: params.owner,
    repo: params.repo,
    issues: issues.data.map((issue: any) => {
      return {
        id: issue.id,
        title: issue.title,
        body: issue.body, // parseMarkdown(issue.body),
        number: issue.number,
      };
    }),
  });
};

export default function Screen() {
  const { issues, owner, repo } = useLoaderData<typeof loader>();

  return (
    <>
      <div>
        <Link to={`/${owner}`}>{owner}</Link> / {repo}{" "}
        <Link className="nes-btn" to={`/${owner}/${repo}/new`}>
          New Issue
        </Link>
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
            {/* <Markdown content={issue.body} /> */}
            <pre>{issue.body}</pre>
          </div>
        ))}
      </div>
    </>
  );
}
