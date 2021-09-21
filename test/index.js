const AtRulePacker = require('../dist/src').default;

describe('At-rule Packer', () => {
  it('Can merge @rules', async () => {
    const css = `
      /* comment */
  
      .outer {
        contain: none;
      }

      @media (max-width: 600px) {
        .cls {
          font-weight: normal;
        }
      }

      @media (max-width: 600px) {
        #cls {
          color: blue;
        }
      }

      @supports (display: grid) {
        div {
          display: grid;
        }
      }
    `;

    expect(AtRulePacker(css)).toBe(
      '.outer{contain:none}@media (max-width:600px){.cls{font-weight:normal}#cls{color:blue}}@supports (display:grid){div{display:grid}}'
    );
  });
});
