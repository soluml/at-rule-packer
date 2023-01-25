const AtRulePacker = require('../dist/tool').default;

function clearWhiteSpaceAndCallATP(css) {
  return AtRulePacker(css).replace(/\s/g, '');
}

/* eslint-disable max-len */

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

      @container named (min-width: 800px){
        .card3 {
          color: red;
        }
      }

      @container named (min-width: 800px){
        .card4 {
          color: blue;
        }
      }
    `;

    expect(clearWhiteSpaceAndCallATP(css)).toBe(
      '/*comment*/.outer{contain:none;}@supports(display:grid){div{display:grid;}}@media(max-width:600px){.cls{color:#00f;}#cls{color:blue;}}@container(min-width:700px){.card{display:grid;grid-template-columns:2fr1fr;}.card2{display:grid;grid-template-columns:1fr2fr;}}@containernamed(min-width:800px){.card3{color:red;}.card4{color:blue;}}'
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

  it('Should not merge @font-face', async () => {
    const css = `
      @font-face {
          font-family: 'Open Sans';
          font-style: normal;
          font-weight: 400;
          src: url('/fonts/OpenSans-Regular.woff2') format('woff2');
      }

      @font-face {
          font-family: 'Open Sans';
          font-style: normal;
          font-weight: 700;
          src: url('/fonts/OpenSans-Bold.woff2') format('woff2');
      }
    `;

    expect(clearWhiteSpaceAndCallATP(css)).toBe(
      `@font-face{font-family:'OpenSans';font-style:normal;font-weight:400;src:url('/fonts/OpenSans-Regular.woff2')format('woff2');}@font-face{font-family:'OpenSans';font-style:normal;font-weight:700;src:url('/fonts/OpenSans-Bold.woff2')format('woff2');}`
    );
  });

  it('Should not merge @when / @else', async () => {
    const css = `
      @when media(width >= 400px) and media(pointer: fine) and supports(display: flex) {
        .cond {
          color: red;
        }
      } @else supports(caret-color: pink) and supports(background: double-rainbow()) {
        .cond {
          color: white;
        }
      } @else {
        .cond {
          color: blue;
        }
      }

      @when media(width >= 400px) and media(pointer: fine) and supports(display: flex) {
        .cond2 {
          color: red;
        }
      } @else supports(caret-color: pink) and supports(background: double-rainbow()) {
        .cond2 {
          color: green;
        }
      } @else {
        .cond2 {
          color: blue;
        }
      }
    `;

    expect(clearWhiteSpaceAndCallATP(css)).toBe(
      `@whenmedia(width>=400px)andmedia(pointer:fine)andsupports(display:flex){.cond{color:red;}}@elsesupports(caret-color:pink)andsupports(background:double-rainbow()){.cond{color:white;}}@else{.cond{color:blue;}}@whenmedia(width>=400px)andmedia(pointer:fine)andsupports(display:flex){.cond2{color:red;}}@elsesupports(caret-color:pink)andsupports(background:double-rainbow()){.cond2{color:green;}}@else{.cond2{color:blue;}}`
    );
  });

  it('Real life example leveraging CSS variables', async () => {
    const css = `
    @media (min-width: 45em) {
      .headerToggleButton {
        display: none;

      }

      .headerNavList {
          flex-direction: row;
          gap: 1.25em;
          height: auto;
          position: static;
         transform: none;
          width: auto;
      }
  }




      @media (min-width: 45em) {
        .headerNav {
          background: none;
          color: rgb(var(--menu-text));
          font-size: 1em;
          height: auto;
          position: static;
          transform: none;
          width: auto;
        }
        .headerNavList>* {
          transform: none;
          width: auto;
        }
      }

      @media (min-width: 45em) {
        .headerNavlinkHome {
          display: none;
        }
    }
    @keyframes float {
      50% {
        transform: translateY(-10%) rotate(10deg);
      }
    }
    `;

    expect(clearWhiteSpaceAndCallATP(css)).toBe(
      `@media(min-width:45em){.headerToggleButton{display:none;}.headerNavList{flex-direction:row;gap:1.25em;height:auto;position:static;transform:none;width:auto;}.headerNav{background:none;color:rgb(var(--menu-text));font-size:1em;height:auto;position:static;transform:none;width:auto;}.headerNavList>*{transform:none;width:auto;}.headerNavlinkHome{display:none;}}@keyframesfloat{50%{transform:translateY(-10%)rotate(10deg);}}`
    );
  });
});
