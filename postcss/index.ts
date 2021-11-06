import type {Plugin} from 'postcss';
import ATP from '../tool';

module.exports = (): Plugin => ({
  postcssPlugin: 'at-rule-packer',
  Root(root) {
    ATP(root);
  },
});

module.exports.postcss = true;
