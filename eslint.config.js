const {defineConfig} = require('eslint/config');

const tsParser = require('@typescript-eslint/parser');
const prettier = require('eslint-plugin-prettier');
const globals = require('globals');
const js = require('@eslint/js');

const {FlatCompat} = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
  {
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2018,
      sourceType: 'module',
      parserOptions: {},

      globals: {
        ...globals.browser,
      },
    },

    extends: compat.extends(
      'plugin:@typescript-eslint/recommended',
      'plugin:jest/recommended',
      'prettier'
    ),

    plugins: {
      prettier,
    },

    rules: {
      curly: 1,
      '@typescript-eslint/explicit-function-return-type': [0],
      '@typescript-eslint/no-explicit-any': [0],
      '@typescript-eslint/ban-ts-comment': [0],
      '@typescript-eslint/no-var-requires': [0],
      '@typescript-eslint/ban-types': [0],
      'prettier/prettier': 2,
      'ordered-imports': [0],
      'object-literal-sort-keys': [0],
      'max-len': [1, 120],
      'default-case': 0,
      'new-parens': 1,
      'no-bitwise': 0,
      'no-cond-assign': 1,
      'no-trailing-spaces': 0,
      'no-param-reassign': 1,
      'no-use-before-define': 1,
      'eol-last': 1,

      'func-style': [
        'error',
        'declaration',
        {
          allowArrowFunctions: true,
        },
      ],

      semi: 1,
      'no-var': 0,
      'no-plusplus': 0,
      'func-names': 0,
      'consistent-return': 1,
      'import/no-unresolved': 0,
      'import/extensions': 0,
      '@typescript-eslint/no-require-imports': 0,
    },
  },
]);
