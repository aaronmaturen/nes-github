import { type LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { createRepoIssue } from "~/services/github.server";

import { authenticator } from "~/services/auth.server";

export const action = async ({ request, params }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const body = await request.formData();

  await createRepoIssue({
    user: user,
    owner: params.owner!,
    repo: params.repo!,
    title: body.get("title") as string,
    description: body.get("description") as string,
  });

  return redirect(`/${params.owner}/${params.repo}`);
};

export const loader = async ({ request, params }: LoaderArgs) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  return null;
};

export default function Screen() {
  return (
    <div className="nes-container with-title mt-5">
      <p className="title">Create New Issue</p>
      <Form method="post">
        <div className="flex flex-col gap-4">
          <p>Oh no! You Found an issue. Thanks for reporting it.</p>
          <div className="nes-field">
            <label htmlFor="title">title</label>
            <input
              required
              type="text"
              id="title"
              name="title"
              className="nes-input"
            />
          </div>
          <label htmlFor="description">Textarea</label>
          <textarea
            required
            name="description"
            id="description"
            className="nes-textarea"
          ></textarea>
          <button type="submit" className="nes-btn is-primary">
            Open Issue
          </button>
        </div>
      </Form>
    </div>
  );
}
