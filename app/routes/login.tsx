import { Form } from "@remix-run/react";
import { type User } from "~/services/session.server";
import { authenticator } from "~/services/auth.server";
import { type DataFunctionArgs, json, redirect } from "@remix-run/node";

type LoaderData = {
  user: User | null;
};

export async function loader({ request }: DataFunctionArgs) {
  const session = await authenticator.isAuthenticated(request);

  if (session) return redirect("/account");

  return json<LoaderData>({ user: session });
}

export default function Login() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Form action="/auth/github" method="post">
        <button className="nes-btn is-primary">
          <div className="flex items-center justify-center gap-4">
            <i className="nes-octocat animate"></i>
            <span>Login with GitHub</span>
          </div>
        </button>
      </Form>
    </div>
  );
}
