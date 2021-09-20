const AtRulePacker = require("../dist/src").default;

describe("At-rule Packer", () => {
  it("Can merge @rules", async () => {
    const css = `
      /* comment */
  
      .outer {
        contain: none;
      }

      @media (max-width: 600px) {
        /* comment */

        .cls {
          font-weight: normal;
        }
      }

      @media (max-width: 600px) {
        #cls {
          color: blue;
        }
      }
    `;

    expect(AtRulePacker(css)).toBe("");
  });
});
