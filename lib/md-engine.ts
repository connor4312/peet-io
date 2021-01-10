import shiki from 'rehype-shiki';
import html from 'rehype-stringify';
import footnotes from 'remark-footnotes';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import unified from 'unified';
import { Node } from 'unist';

export const makeProcessor = () =>
  unified()
    .use(markdown)
    .use(footnotes, { inlineNotes: true })
    .use(() => prettifyMarkup)
    .use(remark2rehype)
    .use(shiki, { theme: `${process.cwd()}/lib/monochrome-dark.json` })
    .use(html);

const prettifyMarkup = (root: Node) => {
  transformMd(root, (node) => {
    if (node.type !== 'text') {
      return node;
    }

    const cast = node as Node & { value: string };
    cast.value = cast.value.replace(/(\S)--(\S)/g, '$1—$2');

    let lastEnd = 0;
    let nodes: Node[] = [];
    for (const match of Array.from(cast.value.matchAll(/~~(.*?)~~/g))) {
      nodes.push(
        { type: 'text', value: cast.value.slice(lastEnd, match.index) },
        { type: 'delete', children: [{ type: 'text', value: match[1] }] },
      );

      lastEnd = match.index! + match[0].length;
    }

    nodes.push({ type: 'text', value: cast.value.slice(lastEnd) });
    return nodes;
  });
};

export const getFirstMd = (node: Node, filter: (n: Node) => boolean): Node | undefined => {
  if (filter(node)) {
    return node;
  }

  for (const child of (node.children as Node[]) ?? []) {
    const r = getFirstMd(child, filter);
    if (r) {
      return r;
    }
  }

  return undefined;
};

export const transformMd = (node: Node, transform: (n: Node) => Node | Node[]): Node | Node[] => {
  if (node.children) {
    node.children = (node.children as Node[]).flatMap((n) => transformMd(n, transform));
  }

  return transform(node);
};
