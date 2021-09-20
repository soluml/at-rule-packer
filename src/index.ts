import csstree from "css-tree";

export interface AST {
  type: "StyleSheet";
  loc: csstree.CssLocation | null;
  children: (csstree.Atrule | csstree.Rule)[];
}

const deepClone = (obj: object) => JSON.parse(JSON.stringify(obj));

export default function AtRulePacker(css: string): string {
  const ast = csstree.parse(css) as any as AST;
  const packedAst: AST = {
    type: "StyleSheet",
    loc: null,
    children: [],
  };

  const processAtrule = (atrule: csstree.Atrule) => {
    console.log("HELLO");

    return atrule;
  };

  // Process AST children
  ast.children.forEach((child) => {
    if (child.type === "Atrule") {
      packedAst.children.push(processAtrule(child));
    } else {
      packedAst.children.push(child);
    }
  });

  packedAst.children = packedAst.children.flat();

  return csstree.generate(ast as any as csstree.CssNode);
}
