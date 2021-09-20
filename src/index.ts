import csstree from "css-tree";

export interface AST {
  type: "StyleSheet";
  loc: csstree.CssLocation | null;
  children: (csstree.Atrule | csstree.Rule)[];
}

const deepClone = (obj: object) => JSON.parse(JSON.stringify(obj));

export default function AtRulePacker(css: string): string {
  const ast = csstree.parse(css) as any as AST;

  console.log({ ast });

  return "";
}
