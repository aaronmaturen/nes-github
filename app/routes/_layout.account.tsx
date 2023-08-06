import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUser } from "~/services/github.server";

import { authenticator } from "~/services/auth.server";

export const action = async ({ request }: ActionArgs) => {
  await authenticator.logout(request, { redirectTo: "/" });
};

export const loader = async ({ request }: LoaderArgs) => {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const user = await getUser(session);

  return json({ user: user.data });
};

export default function Screen() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <pre>
      <code>{JSON.stringify(user, null, 2)}</code>
    </pre>
  );
}
