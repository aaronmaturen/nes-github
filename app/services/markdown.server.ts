// app/services/markdown.server.ts
import { parse, transform, type RenderableTreeNodes } from "@markdoc/markdoc";

export function parseMarkdown(markdown: string): RenderableTreeNodes | string {
  try {
    return transform(parse(markdown));
  } catch (error) {
    return markdown;
  }
}
