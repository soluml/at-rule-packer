import csstree from 'css-tree';

export interface AST {
  type: 'StyleSheet';
  loc: csstree.CssLocation | null;
  children: (csstree.Atrule | csstree.Rule)[];
}

const deepClone = (obj: object) => JSON.parse(JSON.stringify(obj));

export default function AtRulePacker(css: string): string {
  const dast = deepClone(csstree.parse(css)) as any as AST;
  const duplicateMap = new Map();

  const processAtrule = (atrule: csstree.Atrule) => {
    const {type, children} = atrule.prelude as csstree.AtrulePrelude;
    const key = type + JSON.stringify(children);

    if (duplicateMap.has(key)) {
      const doppel = duplicateMap.get(key);

      doppel.block.children = doppel.block.children.concat(
        atrule.block?.children || []
      );
      return;
    }

    if (atrule.block?.children) {
      // @ts-ignore
      atrule.block.children = processRules(atrule.block as AST); // eslint-disable-line
    }

    duplicateMap.set(key, atrule);

    return atrule;
  };

  // Process AST children
  const processRules = (ast: AST) =>
    ast.children
      .map((child) => {
        if (child.type === 'Atrule') {
          return processAtrule(child);
        }

        return child;
      })
      .filter((f) => f) as AST['children'];

  dast.children = processRules(dast);

  return csstree.generate(dast as any as csstree.CssNode);
}
