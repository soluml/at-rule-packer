const AtRulePacker = require('../dist/tool').default;

function clearWhiteSpaceAndCallATP(css) {
  return AtRulePacker(css).replace(/(?<!@layer)\s+/g, '');
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

      @starting-style {
        #target {
          background-color: transparent;
        }
      }

      @starting-style {
        #target2 {
          background-color: red;
        }
      }

      @supports selector(::scroll-marker) {
        li::scroll-marker {
          background-color: red;
        }
      }

      @supports selector(::scroll-marker) {
        li::scroll-marker {
          color: black;
        }
      }

      @supports selector(::scroll-button(*)) {
        li::scroll-marker {
          background-color: red;
        }
      }

      @supports selector(::scroll-button(*)) {
        li::scroll-marker {
          color: black;
        }
      }

      @supports selector(::scroll-button(left)) {
        li::scroll-marker {
          color: black;
        }
      }
    `;

    expect(clearWhiteSpaceAndCallATP(css)).toBe(
      '/*comment*/.outer{contain:none;}@supports(display:grid){div{display:grid;}}@media(max-width:600px){.cls{color:#00f;}#cls{color:blue;}}@container(min-width:700px){.card{display:grid;grid-template-columns:2fr1fr;}.card2{display:grid;grid-template-columns:1fr2fr;}}@containernamed(min-width:800px){.card3{color:red;}.card4{color:blue;}}@starting-style{#target{background-color:transparent;}#target2{background-color:red;}}@supportsselector(::scroll-marker){li::scroll-marker{background-color:red;}li::scroll-marker{color:black;}}@supportsselector(::scroll-button(*)){li::scroll-marker{background-color:red;}li::scroll-marker{color:black;}}@supportsselector(::scroll-button(left)){li::scroll-marker{color:black;}}'
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

      @layer utils {
        @supports (color: light-dark(red, tan)) {
          .text {
            color: light-dark(#fafaf7, #22242a);
          }
        }
      }

      @layer utils {
        @supports (color: light-dark(red, tan)) {
          .text2 {
            color: light-dark(red, tan);
          }
        }
      }
    `;

    expect(clearWhiteSpaceAndCallATP(css)).toBe(
      '@media(max-width:600px){@media(prefers-color-scheme:dark){.innerinner{font-weight:normal;}#innerinner{color:white;}}}@layer utils{@supports(color:light-dark(red,tan)){.text{color:light-dark(#fafaf7,#22242a);}.text2{color:light-dark(red,tan);}}}'
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

  it('Will not apply to natively nested CSS at-rules', async () => {
    const css = `
      [popover]:popover-open {
        opacity: 1;
        transform: scaleX(1);

        @starting-style {
          opacity: 0;
        }
      }

      [popover]:popover-open {
        color: red;

        @starting-style {
          transform: scaleX(0);
        }
      }
    `;

    expect(clearWhiteSpaceAndCallATP(css)).toBe(
      `[popover]:popover-open{opacity:1;transform:scaleX(1);@starting-style{opacity:0;}}[popover]:popover-open{color:red;@starting-style{transform:scaleX(0);}}`
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

  it('Should not merge @layer', async () => {
    const css = `
      @layer {
          font-family: 'Open Sans';
      }

      @layer reset, body;

      @layer reset {
          font-family: 'Open Serif';
      }
    `;

    expect(clearWhiteSpaceAndCallATP(css)).toBe(
      `@layer {font-family:'OpenSans';}@layer reset,body;@layer reset{font-family:'OpenSerif';}`
    );
  });

  it('Should not merge @property', async () => {
    const css = `
      @property --rotation {
        syntax: "<angle>";
        inherits: false;
        initial-value: 45deg;
      }

      @property --rotation {
        syntax: "<angle>";
        inherits: false;
        initial-value: 50deg;
      }
    `;

    expect(clearWhiteSpaceAndCallATP(css)).toBe(
      `@property--rotation{syntax:\"<angle>\";inherits:false;initial-value:45deg;}@property--rotation{syntax:\"<angle>\";inherits:false;initial-value:50deg;}`
    );
  });

  it('Can handle @view-transition', async () => {
    const css = `
      /* comment */

      @view-transition {
        navigation: auto;
      }

      @view-transition {
        navigation: none;
      }
    `;

    expect(clearWhiteSpaceAndCallATP(css)).toBe(
      '/*comment*/@view-transition{navigation:auto;navigation:none;}'
    );
  });

  it('Can handle @scope', async () => {
    const css = `
      @scope (.article-body) to (figure) {
        img {
          border: 5px solid black;
          background-color: goldenrod;
        }
      }

      @scope (.article-body) to (figure) {
        .text {
          color: white;
        }
      }

      @scope (.article-body) {
        img {
          border: 5px solid black;
          background-color: goldenrod;
        }
      }

      @scope (.article-body) {
        .text {
          color: red;
        }
      }

      @scope (.other) {
        .text {
          color: red;
        }
      }
    `;

    expect(clearWhiteSpaceAndCallATP(css)).toBe(
      `@scope(.article-body)to(figure){img{border:5pxsolidblack;background-color:goldenrod;}.text{color:white;}}@scope(.article-body){img{border:5pxsolidblack;background-color:goldenrod;}.text{color:red;}}@scope(.other){.text{color:red;}}`
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
