import type {Plugin} from 'postcss';
import postcss from 'postcss';
import ATP from '../src';

module.exports = (): Plugin => ({
  postcssPlugin: 'at-rule-packer',

  Root(root) {
    const processedCss = ATP(root.toString());
    const newRoot = postcss.parse(processedCss);

    // `root.replaceWith(newRoot)` didn't seem to work here, so just swap out for the new nodes
    root.nodes = newRoot.nodes;
  },
});

module.exports.postcss = true;
