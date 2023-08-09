import { type LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import {
  closeIssue,
  createIssueComment,
  getIssueComments,
  getIssueEvents,
  getRepoIssue,
  reopenIssue,
} from "~/services/github.server";
import { Markdown } from "~/components/markdown";
import { parseMarkdown } from "~/services/markdown.server";

import { authenticator } from "~/services/auth.server";

export const action = async ({ request, params }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const body = await request.formData();

  if (body.get("intent") === "comment") {
    await createIssueComment({
      user: user,
      owner: params.owner!,
      repo: params.repo!,
      issue: params.number!,
      body: body.get("body") as string,
    });
  }

  if (body.get("intent") === "close") {
    await closeIssue({
      user: user,
      owner: params.owner!,
      repo: params.repo!,
      issue: params.number!,
    });
  }

  if (body.get("intent") === "reopen") {
    await reopenIssue({
      user: user,
      owner: params.owner!,
      repo: params.repo!,
      issue: params.number!,
    });
  }

  return redirect(`/${params.owner}/${params.repo}/${params.number}`);
};

export const loader = async ({ request, params }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const [issue, comments, events] = await Promise.all([
    getRepoIssue({
      user: user,
      owner: params.owner!,
      repo: params.repo!,
      number: params.number!,
    }),
    getIssueComments({
      user: user,
      owner: params.owner!,
      repo: params.repo!,
      number: params.number!,
    }).then(({ data }) =>
      data.map((comment: any) => {
        console.log(comment);
        return {
          id: comment.id,
          body: parseMarkdown(comment.body),
          user: comment.user.login,
          avatar: comment.user.avatar_url,
          created_at: comment.created_at,
          type: "comment",
        };
      })
    ),
    getIssueEvents({
      user: user,
      owner: params.owner!,
      repo: params.repo!,
      number: params.number!,
    }).then(({ data }) =>
      data.map((event: any) => {
        return {
          id: event.id,
          event: event.event,
          user: event.actor.login,
          created_at: event.created_at,
          type: "event",
        };
      })
    ),
  ]);

  return json({
    user,
    owner: params.owner,
    repo: params.repo,
    issue: {
      id: issue.data.id,
      title: issue.data.title,
      body: parseMarkdown(issue.data.body), //issue.data.body,
      pull_request: Boolean(issue.data.pull_request),
      state: issue.data.state,
      canClose: issue.data.author_association !== "NONE",
      comments: comments,
      events: events,
      feed: [...events, ...comments].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      ),
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
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
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
            {issue.canClose && (
              <Form method="post" className="self-end	">
                <button
                  type="submit"
                  name="intent"
                  value={issue.state === "open" ? "close" : "reopen"}
                  className={`nes-btn ${
                    issue.state === "open" ? "is-error" : "is-success"
                  }`}
                >
                  {issue.state === "open" ? "close" : "reopen"}
                </button>
              </Form>
            )}
          </div>
        </div>
        {issue.feed.map((event: any) => {
          return event.type === "event" ? (
            <div
              key={event.id}
              className="nes-container is-rounded flex flex-col gap-4"
            >
              <p>
                {event.user} performed `{event.event}`
              </p>
              <span className="nes-text is-disabled self-end">
                {event.created_at}
              </span>
            </div>
          ) : (
            <div
              key={event.id}
              className="nes-container with-title flex flex-col gap-4"
            >
              <div className="title nes-text is-disabled">
                <div className="flex items-center gap-2">
                  <img
                    className="nes-avatar is-medium is-rounded"
                    alt={`avatar for user ${event.user}`}
                    src={event.avatar}
                  />
                  <span>{event.user}</span>
                </div>
              </div>
              <Markdown content={event.body} />
              <span className="nes-text is-disabled self-end">
                {event.created_at}
              </span>
            </div>
          );
        })}
        <div className="nes-container with-title mt-5">
          <p className="title">
            {issue.comments.length === 0 ? "Start" : "Continue"} Discussion
          </p>
          <Form method="post">
            <div className="flex flex-col gap-4">
              <label htmlFor="body">Type your message</label>
              <textarea
                required
                name="body"
                id="body"
                className="nes-textarea"
              ></textarea>
              <button
                type="submit"
                name="intent"
                value="comment"
                className="nes-btn is-primary"
              >
                Comment
              </button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
