import type { DataFunctionArgs } from "@remix-run/node";
import type { User } from "~/services/session.server";

import { redirect, json } from "@remix-run/node";
import { useLoaderData, Outlet } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";

import { Navigation } from "~/components/navigation";
import { Footer } from "~/components/footer";

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
