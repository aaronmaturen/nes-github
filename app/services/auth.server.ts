import { GitHubStrategy } from "remix-auth-github";
import { Authenticator } from "remix-auth";
import { sessionStorage, type User } from "~/services/session.server";

if (!process.env.BASE_URL) {
  throw new Error("BASE_URL is required");
}

const BASE_URL = process.env.BASE_URL;

/**
 * Inits Authenticator.
 */
export let authenticator = new Authenticator<User>(sessionStorage, {
  throwOnError: true,
});

let gitHubStrategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: new URL("/auth/github/callback", BASE_URL).toString(),
  },
  async ({ profile, accessToken, extraParams }) => {
    var expiresAt = new Date();
    expiresAt.setSeconds(
      expiresAt.getSeconds() + extraParams.accessTokenExpiresIn!
    );

    return {
      profile,
      accessToken,
      extraParams,
      expiresAt,
    };
  }
);

authenticator.use(gitHubStrategy);
