// app/services/markdown.server.ts
import { parse, transform, type RenderableTreeNodes } from "@markdoc/markdoc";

export function parseMarkdown(markdown: string): RenderableTreeNodes {
  return transform(parse(markdown));
}
