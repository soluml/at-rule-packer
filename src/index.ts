import csstree from 'css-tree';

export interface AST {
  type: 'StyleSheet';
  loc: csstree.CssLocation | null;
  children: (csstree.Atrule | csstree.Rule)[];
}

type DuplicateMapValue = [csstree.Atrule, number];
type DuplicateMap = Map<string, DuplicateMapValue>;
type DeleteArr = number[];

const deepClone = (obj: object) => JSON.parse(JSON.stringify(obj));

export default function AtRulePacker(css: string): string {
  const dast = deepClone(csstree.parse(css)) as any as AST;

  const processAtrule = (
    atrule: csstree.Atrule,
    index: number,
    duplicateMap: DuplicateMap,
    deleteArr: DeleteArr
  ) => {
    const {type, children} = atrule.prelude as csstree.AtrulePrelude;
    const key = type + JSON.stringify(children);

    // Remove at-rules with no children
    if (!atrule.block?.children) return;

    if (duplicateMap.has(key)) {
      const [doppel, ind] = duplicateMap.get(key) as DuplicateMapValue;

      // @ts-ignore
      atrule.block.children = (doppel.block as csstree.Block).children.concat(
        atrule.block.children
      );

      deleteArr.push(ind);
    } else {
      // @ts-ignore
      atrule.block.children = processRules(atrule.block as AST);
    }

    duplicateMap.set(key, [atrule, index]);

    return atrule;
  };

  // Process AST children
  const processRules = (ast: AST) => {
    const duplicateMap: DuplicateMap = new Map();
    const deleteArr: DeleteArr = [];

    return ast.children
      .map((child, index) => {
        if (child.type === 'Atrule') {
          return processAtrule(child, index, duplicateMap, deleteArr);
        }

        return child;
      })
      .filter((f, i) => f && !~deleteArr.indexOf(i)) as AST['children'];
  };

  dast.children = processRules(dast);

  return csstree.generate(dast as any as csstree.CssNode);
}
