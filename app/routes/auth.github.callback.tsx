import type { LoaderArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export async function loader({ request }: LoaderArgs) {
  return authenticator.authenticate("github", request, {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    throwOnError: true,
  });
}
