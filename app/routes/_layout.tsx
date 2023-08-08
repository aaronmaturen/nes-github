import type { DataFunctionArgs } from "@remix-run/node";
import type { User } from "~/services/session.server";

import { redirect, json } from "@remix-run/node";
import { useLoaderData, Outlet, Form } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";

import { Navigation } from "~/components/navigation";
import { Footer } from "~/components/footer";

export function ErrorBoundary() {
  return (
    <div>
      <h1>Uh oh ...</h1>
      <p>Something went wrong.</p>
      <p>
        It could be that your token expired, we haven't added the refresh
        logic... just logout and back in :D
      </p>
      <Form action="/auth/logout" method="post">
        <button className="nes-btn is-error">Log Out</button>
      </Form>
    </div>
  );
}

type LoaderData = {
  user: User | null;
};

export async function loader({ request }: DataFunctionArgs) {
  const session = await authenticator.isAuthenticated(request);

  // Force redirect to /account on authenticated user.
  const url = new URL(request.url);
  if (session && url.pathname === "/login") return redirect("/account");

  return json<LoaderData>({ user: session });
}

export default function Layout() {
  // Check bellow info about why we are force casting <LoaderData>
  // https://github.com/remix-run/remix/issues/3931
  const { user } = useLoaderData() as LoaderData;

  return (
    <div className="mx-auto flex h-screen max-w-7xl flex-col gap-4 px-6">
      <Navigation user={user} />
      <Outlet />
      <Footer />
    </div>
  );
}
