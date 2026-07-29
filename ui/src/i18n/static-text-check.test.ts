import { describe, expect, it } from "vitest";

import { checkStaticText } from "./static-text-check";

describe("checkStaticText", () => {
  it("reports visible JSX text and accessibility text", () => {
    expect(checkStaticText('<button aria-label="Save">Save</button>', "Fixture.tsx")).toEqual([
      "Fixture.tsx:1 JSX text must use i18n: Save",
      "Fixture.tsx:1 aria-label must use i18n: Save",
    ]);
  });

  it("ignores technical attributes and machine values", () => {
    expect(
      checkStaticText(
        '<button className="button" data-testid="save" title={label}>Save {id}</button>; const id = "agent-1";',
        "Fixture.tsx",
      ),
    ).toEqual(["Fixture.tsx:1 JSX text must use i18n: Save"]);
  });
});
