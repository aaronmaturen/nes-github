import { type User } from "~/services/session.server";
import { Link, Form, useLocation } from "@remix-run/react";

type NavigationProps = {
  user: User | null;
};

export function Navigation({ user }: NavigationProps) {
  const location = useLocation();

  return (
    <header
      className="z-10 m-auto my-0 flex max-h-[80px] min-h-[80px]
			w-full flex-row items-center justify-between"
    >
      {/* Left Menu. */}
      <Link
        to={"/"}
        prefetch="intent"
        className="flex items-center gap-4 text-2xl font-bold text-black"
      >
        <i className="nes-icon github is-medium"></i>
        Issues
      </Link>

      {/* Right Menu. */}
      <div className="flex flex-row items-center">
        {!user &&
          location &&
          (location.pathname === "/" || location.pathname === "/plans") && (
            <>
              <div className="mx-3" />
              <Link
                to="/login"
                className="flex h-10 flex-row items-center rounded-xl border border-gray-600 px-4 font-bold text-gray-200
					      transition hover:scale-105 hover:border-gray-200 hover:text-gray-100 active:opacity-80"
              >
                Log In
              </Link>
            </>
          )}
        {/* Log Out Form Button. */}
        {user && (
          <div className="flex gap-4">
            <Link className="nes-btn" to="/account">
              My Account
            </Link>
            <Form action="/auth/logout" method="post">
              <button className="nes-btn is-error">Log Out</button>
            </Form>
          </div>
        )}
      </div>
    </header>
  );
}
