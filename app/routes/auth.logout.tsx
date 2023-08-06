import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

// import { logout } from "~/session.server";
const logout = (request: Request) => {
  return null;
};

export const action = async ({ request }: ActionArgs) => logout(request);

export const loader = async () => redirect("/");
