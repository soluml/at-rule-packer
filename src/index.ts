import type {Root, AtRule, ChildNode} from 'postcss';
import postcss from 'postcss';

function getAtRuleKey(atrule: AtRule) {
  return atrule.name + atrule.params;
}

enum Direction { // eslint-disable-line no-shadow
  NEXT = 'next',
  PREV = 'prev',
}

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

function processAtrule(atrule: AtRule): void {
  // Remove at-rules with no children
  if (!atrule.nodes.length) {
    atrule.remove();
    return;
  }

  // Only process with the top level At-rule
  if (untilAtRule(atrule)) return;

  // Determine unique at-rules and remove ones that are not
  const uniqueAtRules = new Map();

  // loop through next At-rules
  (function p(atr) {
    const key = getAtRuleKey(atr);

    if (uniqueAtRules.has(key)) {
      const ref = uniqueAtRules.get(key) as AtRule;

      ref.nodes.forEach((n) => atr.prepend(n));
      ref.remove();
    } else {
      uniqueAtRules.set(key, atr);
    }

    const nextAtRule = untilAtRule(atr, true);

    if (nextAtRule) {
      p(nextAtRule);
    }
  })(atrule);
}

export default function AtRulePacker(css: string | Root): string | Root {
  const isTypeString = typeof css === 'string';

  // Parse into AST (if string)
  if (isTypeString) {
    css = postcss.parse(css);
  }

  // Process Atrules
  (css as Root).walkAtRules(processAtrule);

  // Restore as string (if it originated as string)
  return isTypeString ? css.toString() : css;
}
