import { type LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getIssueComments, getRepoIssue } from "~/services/github.server";
import { Markdown } from "~/components/markdown";
import { parseMarkdown } from "~/services/markdown.server";

import { authenticator } from "~/services/auth.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const issue = await getRepoIssue({
    user: user,
    owner: params.owner!,
    repo: params.repo!,
    number: params.number!,
  });

  const comments = await getIssueComments({
    user: user,
    owner: params.owner!,
    repo: params.repo!,
    number: params.number!,
  });

  return json({
    user,
    owner: params.owner,
    repo: params.repo,
    issue: {
      id: issue.data.id,
      title: issue.data.title,
      body: parseMarkdown(issue.data.body), //issue.data.body,
      comments: comments.data.map((comment: any) => {
        return {
          id: comment.id,
          body: parseMarkdown(comment.body),
          user: comment.user.login,
        };
      }),
    },
  });
};

export default function Screen() {
  const { issue, owner, repo } = useLoaderData<typeof loader>();
  return (
    <>
      <div>
        <Link to={`/${owner}`}>{owner}</Link> /{" "}
        <Link to={`/${owner}/${repo}`}>{repo}</Link>
      </div>
      <div className="flex flex-col gap-4">
        <div key={issue.id} className="nes-container with-title">
          <p className="title nes-text is-success">{issue.title}</p>
          {/* <pre>{issue.body}</pre> */}
          <Markdown content={issue.body} />
        </div>
        {issue.comments.map((comment: any) => (
          <div key={comment.id} className="nes-container with-title">
            <p className="title nes-text is-disabled">{comment.user}</p>
            {/* <pre>{comment.body}</pre> */}
            <Markdown content={comment.body} />
          </div>
        ))}
      </div>
    </>
  );
}
