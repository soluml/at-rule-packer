const AtRulePacker = require('../dist/src').default;

function clearWhiteSpaceAndCallATP(css) {
  return AtRulePacker(css).replace(/\s/g, '');
}

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

      @container (min-width: 700px){
        .card {
          display: grid;
          grid-template-columns: 2fr 1fr;
        }
      }

      @container (min-width: 700px){
        .card2 {
          display: grid;
          grid-template-columns: 1fr 2fr;
        }
      }
    `;

    expect(clearWhiteSpaceAndCallATP(css)).toBe(
      '/*comment*/.outer{contain:none;}@supports(display:grid){div{display:grid;}}@media(max-width:600px){.cls{color:#00f;}#cls{color:blue;}}@container(min-width:700px){.card{display:grid;grid-template-columns:2fr1fr;}.card2{display:grid;grid-template-columns:1fr2fr;}}'
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

    expect(clearWhiteSpaceAndCallATP(css)).toBe(
      '@media(max-width:600px){@media(prefers-color-scheme:dark){.innerinner{font-weight:normal;}#innerinner{color:white;}}}'
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

    expect(clearWhiteSpaceAndCallATP(css)).toBe(
      '@media(max-width:600px){@media(max-width:600px){@media(max-width:600px){.innerinner{font-weight:normal;}#innerinner{color:white;}}}}'
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

    expect(clearWhiteSpaceAndCallATP(css)).toBe(
      '.hello{color:black;}.world{color:#111;}@media(prefers-color-scheme:dark){.hello{color:white;}.world{color:#efefef;}}'
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

    expect(clearWhiteSpaceAndCallATP(css)).toBe(
      '.mydiv{color:blue;font-size:1em;font-weight:bold;}/*Utilities*/.font-size--medium{font-size:1em;}.aspect-ratio--video{aspect-ratio:16/9;}@media(min-width:64em){.mydiv{font-size:1.25em;}.aspect-ratio--video{aspect-ratio:4/3;}}'
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

    expect(clearWhiteSpaceAndCallATP(css)).toBe(
      '@supportsnot(display:grid){main{float:right;}.grid{display:flex;}}'
    );
  });
});
