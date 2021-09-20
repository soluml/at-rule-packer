const AtRulePacker = require("../dist/src").default;

describe("At-rule Packer", () => {
  it("Can merge @rules", async () => {
    const css = `
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
    `;

    expect(AtRulePacker(css)).toBe("");
  });
});
