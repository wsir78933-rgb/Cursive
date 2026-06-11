import { describe, expect, it } from "vitest";

import { filterTextStyles, textStyles } from "./text-styles";

describe("filterTextStyles", () => {
  it("returns every configured style for the All filter", () => {
    expect(filterTextStyles("all")).toHaveLength(textStyles.length);
  });

  it("includes Unicode styles in the social platform filter", () => {
    const socialStyleIds = filterTextStyles("social").map((style) => style.id);

    expect(socialStyleIds).toContain("unicode-script");
    expect(socialStyleIds).toContain("unicode-bold");
    expect(socialStyleIds).not.toContain("brush-script-mt");
  });

  it("separates Google Docs default, installable, and Microsoft Word filters", () => {
    expect(filterTextStyles("google-docs-default").map((style) => style.id)).toContain(
      "pacifico"
    );
    expect(
      filterTextStyles("google-docs-installable").map((style) => style.id)
    ).toContain("dancing-script");
    expect(filterTextStyles("ms-word").map((style) => style.id)).toContain(
      "brush-script-mt"
    );
  });
});
