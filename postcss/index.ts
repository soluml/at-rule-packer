import type * as postcssType from 'postcss';
import ATP from '../src';
// import saveJSON from './saveJSON';

module.exports = (): postcssType.Plugin =>
  // async function processRule(rule: postcssType.Rule) {
  //   /* eslint-disable no-param-reassign */
  //   const topRule = (function getParent(r: postcssType.Rule): postcssType.Rule {
  //     if (r.parent?.type === 'root') {
  //       return r;
  //     }
  //     return getParent(r.parent as postcssType.Rule);
  //   })(rule);

  //   // const isSameAsTopRule = rule.toString() === topRule.toString();
  //   let jsonKey = '';

  //   // Set jsonKey and update selector
  //   if (~rule.selector.indexOf(replacedSelectorPlaceholder)) {
  //     throw new Error(
  //       `The placeholder (${replacedSelectorPlaceholder}) was used in a css selector. Please replace all instances of this selector with another value!`
  //     );
  //   }

  //   rule.selector = parser((selectors) => {
  //     selectors.walkClasses((selector) => {
  //       if (!selector.sourceIndex) {
  //         jsonKey = selector.value;
  //         selector.replaceWith(
  //           parser.className({value: replacedSelectorPlaceholder})
  //         );
  //       }
  //     });
  //   }).processSync(rule.selector);
  //   rule.selectors = [rule.selector];

  //   // Get classNames
  //   const psProcessObj = await PS.process(topRule.toString());

  //   // Add set (if needed)
  //   if (!json[jsonKey]) {
  //     json[jsonKey] = new Set();
  //   }

  //   // Update set
  //   Object.values(psProcessObj.classNames).forEach((c) => json[jsonKey].add(c));

  //   const newCss = psProcessObj.css.replaceAll(
  //     ` .${replacedSelectorPlaceholder}`,
  //     ''
  //   );
  //   const newRules = postcss.parse(newCss);

  //   updates.push([topRule, newRules]);
  //   /* eslint-enable no-param-reassign */
  // }

  ({
    postcssPlugin: 'at-rule-packer',

    async OnceExit(root, {result}) {
      // const getJSON = config.getJSON || saveJSON;
      // // Perform Updates
      // updates.forEach(([oldRule, newRootRule]) => {
      //   oldRule.replaceWith(newRootRule);
      // });
      // // Re-normalize to eliminate extra rules
      // const newRoot = postcss.parse(Normalize(root.toString()));
      // const exportTokens = Object.entries(json).reduce(
      //   (acc, [key, acs]) => ({
      //     ...acc,
      //     [key]: Array.from(acs).join(' '),
      //   }),
      //   {}
      // );
      // // `root.replaceWith(newRoot)` didn't seem to work here, so just swap out for the new nodes
      // root.nodes = newRoot.nodes; // eslint-disable-line no-param-reassign
      // result.messages.push({
      //   type: 'export',
      //   plugin: postcssPlugin,
      //   exportTokens,
      // });
      // await getJSON(
      //   root.source!.input.file as string,
      //   exportTokens,
      //   result.opts.to
      // );

      console.log('EXIT');
    },
  });

module.exports.postcss = true;
