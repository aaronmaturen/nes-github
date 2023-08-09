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

  // parse the search params for `?q=`
  const url = new URL(request.url);
  const includeClosed = url.searchParams.get("includeClosed") === "true";
  const page = url.searchParams.get("page") ?? "1";

  // const issues = await getMyIssues(user);

  const [issues, details, starred] = await Promise.all([
    getRepoIssues({
      user: user,
      owner: params.owner!,
      repo: params.repo!,
      page,
      includeClosed,
    }),
    getRepoDetails({
      user: user,
      owner: params.owner!,
      repo: params.repo!,
    }),
    isStarred({
      user: user,
      owner: params.owner!,
      repo: params.repo!,
    }),
  ]);

  const pagination =
    issues.headers.link
      ?.split(",")
      .reduce<{ [key: string]: string }>((a, b) => {
        const [page, key] = b.split(";").map((s) => s.trim());
        const pageMatch = page.match(/page=(\d+)/);
        const keyMatch = key.match(/rel="(.+)"/);
        if (pageMatch && keyMatch) {
          a[keyMatch[1]] = pageMatch[1];
        }
        return a;
      }, {}) ?? {};

  return json({
    user,
    includeClosed,
    owner: params.owner,
    repo: params.repo,
    page,
    pagination,
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
  const {
    issues,
    owner,
    repo,
    page,
    stars,
    starred,
    pagination,
    includeClosed,
  } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <Link to={`/${owner}`}>{owner}</Link> / {repo}{" "}
          <Link className="nes-btn" to={`/${owner}/${repo}/new`}>
            New Issue
          </Link>
        </div>
        <Form method="get">
          <button
            className="nes-text is-primary"
            name="includeClosed"
            value={includeClosed ? "false" : "true"}
          >
            <input
              type="checkbox"
              className="nes-checkbox"
              checked={includeClosed}
              readOnly
            />
            <span>Include Closed? {includeClosed}</span>
          </button>
        </Form>
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
        {(page !== "1" || pagination.next) && (
          <Form method="get" className="flex items-center gap-4 self-end">
            <button
              className={`nes-btn ${
                pagination.first ? "is-default" : "is-disabled"
              }`}
              name="page"
              value={pagination.first}
              disabled={!pagination.first}
            >
              First
            </button>
            <button
              className={`nes-btn ${
                pagination.prev ? "is-default" : "is-disabled"
              }`}
              name="page"
              value={pagination.prev}
              disabled={!pagination.prev}
            >
              Prev
            </button>
            {page}
            {pagination.last ? ` of ${pagination.last}` : ` of ${page}`}
            <button
              className={`nes-btn ${
                pagination.next ? "is-default" : "is-disabled"
              }`}
              name="page"
              value={pagination.next}
              disabled={!pagination.next}
            >
              Next
            </button>
            <button
              className={`nes-btn ${
                pagination.last ? "is-default" : "is-disabled"
              }`}
              name="page"
              value={pagination.last}
              disabled={!pagination.last}
            >
              Last
            </button>
          </Form>
        )}
      </div>
    </>
  );
}
