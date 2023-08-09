import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUser, getInstallationDetails } from "~/services/github.server";

import { authenticator } from "~/services/auth.server";

export const action = async ({ request }: ActionArgs) => {
  await authenticator.logout(request, { redirectTo: "/" });
};

export const loader = async ({ request }: LoaderArgs) => {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const user = await getUser(session);
  const installations = await getInstallationDetails({
    user: session,
    installation: "40523289",
  });

  return json({ installations, user: user.data, session });
};

export default function Screen() {
  const { installations, session, user } = useLoaderData<typeof loader>();
  return (
    <pre>
      <code>{JSON.stringify({ installations, session, user }, null, 2)}</code>
    </pre>
  );
}
