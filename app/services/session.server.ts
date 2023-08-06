import { createCookieSessionStorage } from "@remix-run/node";
import { type GitHubExtraParams, type GitHubProfile } from "remix-auth-github";
import invariant from "tiny-invariant";

export type User = {
  profile: GitHubProfile;
  accessToken: string;
  extraParams: GitHubExtraParams;
};

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});
