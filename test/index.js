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
          color: #00f;
        }
      }

      @supports (display: grid) {
        div {
          display: grid;
        }
      }

      @media (max-width: 600px) {
        #cls {
          color: blue;
        }
      }
    `;

    expect(AtRulePacker(css)).toBe(
      '.outer{contain:none}@supports (display:grid){div{display:grid}}@media (max-width:600px){.cls{color:#00f}#cls{color:blue}}'
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

  it('Can merge deeply nested duplicate @rules', async () => {
    const css = `
      @media (max-width: 600px) {
        @media (max-width: 600px) {
          @media (max-width: 600px) {
            .innerinner {
              font-weight: normal;
            }
          }
        }

        @media (max-width: 600px) {
          @media (max-width: 600px) {
            #innerinner {
              color: white;
            }
          }
        }
      }

    `;

    expect(AtRulePacker(css)).toBe(
      '@media (max-width:600px){@media (max-width:600px){@media (max-width:600px){.innerinner{font-weight:normal}#innerinner{color:white}}}}'
    );
  });
});
