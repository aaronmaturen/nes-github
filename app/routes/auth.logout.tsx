import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

// import { logout } from "~/session.server";
export async function action({ request }: ActionArgs) {
  await authenticator.logout(request, { redirectTo: "/login" });
}

export const loader = async () => redirect("/");
