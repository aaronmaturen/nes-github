import { type LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import {
  getOrgRepos,
  getUserRepos,
  getOwnerDetails,
} from "~/services/github.server";

import { authenticator } from "~/services/auth.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const ownerDetails = await getOwnerDetails(user, params.owner!);

  const repos =
    ownerDetails.data.type === "User"
      ? await getUserRepos({
          user: user,
          owner: params.owner!,
        })
      : await getOrgRepos({
          user: user,
          owner: params.owner!,
        });

  return json({
    user,
    repos: repos.data.map((repo: any) => {
      return {
        // name: repo.name,
        // description: repo.description,
        // has_issues: repo.has_issues,
        ...repo,
      };
    }),
  });
};

export default function Screen() {
  const { repos } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-4">
      {repos.length === 0 && (
        <div className="nes-container with-title">no repos</div>
      )}
      {repos.map((repo: any) => (
        <div key={repo.id} className="nes-container with-title">
          <Link className="title" to={repo.name}>
            {repo.name}
          </Link>
          <div>{repo.description}</div>
        </div>
      ))}
    </div>
  );
}
