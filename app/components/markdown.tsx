// app/components/markdown.tsx
import { renderers, type RenderableTreeNodes } from "@markdoc/markdoc";
import * as React from "react";

type Props = { content: RenderableTreeNodes | string };

export function Markdown({ content }: Props) {
  if (typeof content === "string") {
    return <pre>{content}</pre>;
  }
  return <>{renderers.react(content, React)}</>;
}
