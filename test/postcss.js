const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const atRulePackerPlugin = require('../dist/postcss');

/* eslint-disable max-len */

describe('postcss', () => {
  it('Should process css files', async () => {
    const from = path.resolve(__dirname, 'test.css');
    const css = await fs.promises.readFile(from, 'utf8');
    const result = await postcss([atRulePackerPlugin]).process(css, {from});

    expect(result.css.replace(/\s/g, '')).toBe(
      '.mydiv{color:blue;font-size:1em;font-weight:bold;}/*Utilities*/.font-size--medium{font-size:1em;}.aspect-ratio--video{aspect-ratio:16/9;}@media(min-width:64em){.mydiv{font-size:1.25em;}.aspect-ratio--video{aspect-ratio:4/3;}}'
    );
  });
});
