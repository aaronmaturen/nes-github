// app/components/markdown.tsx
import { renderers, type RenderableTreeNodes } from "@markdoc/markdoc";
import * as React from "react";

type Props = { content: RenderableTreeNodes };

export function Markdown({ content }: Props) {
  return <>{renderers.react(content, React)}</>;
}
