import {
  readFileSync,
} from "node:fs";

import {
  resolve,
} from "node:path";

import {
  describe,
  expect,
  it,
} from "vitest";

const childSearchCssPath =
  resolve(
    process.cwd(),
    "src",
    "pages",
    "ChildSearch.css"
  );

const childSearchCss =
  readFileSync(
    childSearchCssPath,
    "utf8"
  );

describe(
  "ChildSearch stylesheet",
  () => {
    it(
      "contains the search results header styles",
      () => {
        expect(
          childSearchCss
        ).toContain(
          ".search-results__header"
        );

        expect(
          childSearchCss
        ).toContain(
          ".search-results__title"
        );
      }
    );

    it(
      "contains the card and row view toggle styles",
      () => {
        expect(
          childSearchCss
        ).toContain(
          ".view-toggle"
        );

        expect(
          childSearchCss
        ).toContain(
          ".view-toggle__button"
        );

        expect(
          childSearchCss
        ).toContain(
          ".view-toggle__button--active"
        );
      }
    );

    it(
      "keeps the desktop card layout at four columns",
      () => {
        expect(
          childSearchCss
        ).toContain(
          ".search-results__grid"
        );

        expect(
          childSearchCss
        ).toMatch(
          /repeat\(\s*4\s*,\s*minmax\(\s*0\s*,\s*1fr\s*\)\s*\)/
        );
      }
    );

    it(
      "does not accidentally contain detail-page styles",
      () => {
        expect(
          childSearchCss
        ).not.toContain(
          ".detailed-page"
        );

        expect(
          childSearchCss
        ).not.toContain(
          ".back-button"
        );
      }
    );
  }
);