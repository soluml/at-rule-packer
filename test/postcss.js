const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const atRulePackerPlugin = require('../dist/postcss');

describe('postcss', () => {
  it('Should process css files', async () => {
    const from = path.resolve(__dirname, 'test.css');
    const css = await fs.promises.readFile(from, 'utf8');
    const result = await postcss([atRulePackerPlugin]).process(css, {from});

    expect(result.css.trim()).toBe('');
  });
});
