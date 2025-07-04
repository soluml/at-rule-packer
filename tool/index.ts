import type {Root, AtRule, ChildNode} from 'postcss';
import postcss from 'postcss';

function getAtRuleKey(atrule: AtRule) {
  return atrule.name + atrule.params;
}

enum Direction {
  NEXT = 'next',
  PREV = 'prev',
}

/* eslint-disable consistent-return */
function untilAtRule(atrule: ChildNode, forward?: boolean): AtRule | undefined {
  const method = forward ? Direction.NEXT : Direction.PREV;
  const sibling = atrule[method]();

  if (sibling) {
    if (sibling.type === 'atrule') {
      return sibling as AtRule;
    }

    return untilAtRule(sibling, forward);
  }
}
/* eslint-enable consistent-return */

// List of Atrule's that should never be merged
const ignoredAtRules = [
  'import',
  'font-face',
  'layer',
  'property',
  'when',
  'else',
];

function processAtrule(atrule: AtRule): void {
  // Ignore at-rules that should not be merged
  if (~ignoredAtRules.indexOf(atrule.name)) {
    return;
  }

  // Only process with the top level At-rule
  if (untilAtRule(atrule)) {
    return;
  }

  // Determine unique at-rules and remove ones that are not
  const uniqueAtRules = new Map();

  // loop through next At-rules
  (function p(atr) {
    const key = getAtRuleKey(atr);

    if (uniqueAtRules.has(key)) {
      const ref = uniqueAtRules.get(key) as AtRule;

      ref.push(atr);
    } else {
      uniqueAtRules.set(key, [atr]);
    }

    const nextAtRule = untilAtRule(atr, true);

    if (nextAtRule) {
      p(nextAtRule);
    } else {
      uniqueAtRules.forEach((atrs) => {
        if (atrs.length > 1) {
          const target = atrs.pop();

          atrs.reverse().forEach((a: AtRule) => {
            target.prepend(a.nodes);
            a.remove();
          });
        }
      });
    }
  })(atrule);
}

export default function AtRulePacker(css: string | Root): string | Root {
  const isTypeString = typeof css === 'string';
  let ast = css;

  // Parse into AST (if string)
  if (isTypeString) {
    ast = postcss.parse(ast);
  }

  // Process Atrules
  (ast as Root).walkAtRules(processAtrule);

  // Restore as string (if it originated as string)
  return isTypeString ? ast.toString() : ast;
}
