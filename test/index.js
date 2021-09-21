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

  it('Can merge nested @rules', async () => {
    const css = `
      @media (max-width: 600px) {
        @media (prefers-color-scheme: dark) {
          .innerinner {
            font-weight: normal;
          }
        }

        @media (prefers-color-scheme: dark) {
          #innerinner {
            color: white;
          }
        }
      }

    `;

    expect(AtRulePacker(css)).toBe(
      '@media (max-width:600px){@media (prefers-color-scheme:dark){.innerinner{font-weight:normal}#innerinner{color:white}}}'
    );
  });
});
