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

  it('Has README.md examples that work', async () => {
    let css = `
      .hello {
        color: black;
      }
      @media (prefers-color-scheme: dark) {
        .hello {
          color: white;
        }
      }

      .world {
        color: #111;
      }
      @media (prefers-color-scheme: dark) {
        .world {
          color: #efefef;
        }
      }
    `;

    expect(AtRulePacker(css)).toBe(
      '.hello{color:black}.world{color:#111}@media (prefers-color-scheme:dark){.hello{color:white}.world{color:#efefef}}'
    );

    css = `
      .mydiv {
        color: blue;
        font-size: 1em;
        font-weight: bold;
      }

      @media (min-width: 64em) {
        .mydiv {
          font-size: 1.25em;
        }
      }

      /* Utilities */
      .font-size--medium {
        font-size: 1em;
      }

      .aspect-ratio--video {
        aspect-ratio: 16 / 9;
      }

      @media (min-width: 64em) {
        .aspect-ratio--video {
          aspect-ratio: 4 / 3;
        }
      }
    `;

    expect(AtRulePacker(css)).toBe(
      '.mydiv{color:blue;font-size:1em;font-weight:bold}.font-size--medium{font-size:1em}.aspect-ratio--video{aspect-ratio:16 / 9}@media (min-width:64em){.mydiv{font-size:1.25em}.aspect-ratio--video{aspect-ratio:4 / 3}}'
    );

    css = `
      @supports not (display: grid) {
        main {
          float: right;
        }
      }

      @supports not (display: grid) {
        .grid {
          display: flex;
        }
      }
    `;

    expect(AtRulePacker(css)).toBe(
      '@supports not (display:grid){main{float:right}.grid{display:flex}}'
    );
  });
});
