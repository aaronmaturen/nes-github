import { type LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getMyIssues, getMyStarred } from "~/services/github.server";

import { authenticator } from "~/services/auth.server";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const [issues, starred] = await Promise.all([
    getMyIssues(user),
    getMyStarred(user),
  ]);

  return json({
    displayName: user.profile.displayName,
    starred: starred.data.map((star: any) => {
      return {
        repository: star.full_name,
        id: star.id,
      };
    }),
    issues: issues.data.map((issue: any) => {
      return {
        id: issue.id,
        title: issue.title,
        repository: issue.repository.full_name,
        number: issue.number,
        // ...issue,
      };
    }),
  });
};

export default function Screen() {
  const { displayName, issues, starred } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-4">
      <Link className="text-2xl" to="/account">
        {displayName}
      </Link>
      {/* <pre>{JSON.stringify(starred, null, 2)}</pre> */}
      <div className="nes-container with-title">
        <p className="title">Issues</p>
        {issues.length === 0 && <p>You have no assigned issues.</p>}
        <ul className="nes-list is-disc">
          {issues.map((issue: any) => (
            <li key={issue.id}>
              <Link to={`/${issue.repository}/${issue.number}`}>
                {issue.repository} #{issue.number} - {issue.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="nes-container with-title">
        <p className="title">Stars</p>
        <ul className="nes-list is-disc">
          {starred.map((star: any) => (
            <li key={star.id}>
              <Link to={`/${star.repository}`}>{star.repository}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
