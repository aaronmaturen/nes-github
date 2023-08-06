export function Footer() {
  return (
    <footer
      className="z-10 m-auto my-0 flex max-h-[64px] min-h-[64px]
      w-full flex-row items-center justify-center"
    >
      <p className="flex flex-row items-center text-sm font-semibold text-gray-400">
        Created by{" "}
        <a
          href="https://github.com/aaronmaturen"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-row items-center"
        >
          <img
            src="https://avatars.githubusercontent.com/u/507070?v=4"
            alt=""
            className="mx-2 max-h-6 select-none rounded-full brightness-110"
          />
          @aaronmaturen
        </a>
      </p>
    </footer>
  );
}
