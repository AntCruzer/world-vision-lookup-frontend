import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import {
  MemoryRouter,
} from "react-router-dom";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import ChildSearch from "./ChildSearch";

const searchParams = {
  scope: "Available",
  countries: [],
  minAge: "",
  maxAge: "",
  gender: "",
  projectId: "",
  birthDay: "",
  birthMonth: "",
  hasPhoto: "",
  sortBy: "SdChildId",
  language: "en",
};

function renderPage(
  childResults = []
) {
  render(
    <MemoryRouter>
      <ChildSearch
        childResults={
          childResults
        }
        loading={false}
        error={null}
        onRetry={vi.fn()}
        searchParams={
          searchParams
        }
        onFiltersChange={vi.fn()}
        onResetFilters={vi.fn()}
        regions={[]}
        countryOptions={[]}
        selectedRegion=""
        onRegionChange={vi.fn()}
        lookupLoading={false}
        lookupError={null}
        pageInfo={{
          page: 1,
          pageSize: 10,
          hasNextPage: false,
          total: undefined,
        }}
        onPreviousPage={vi.fn()}
        onNextPage={vi.fn()}
      />
    </MemoryRouter>
  );
}

describe("ChildSearch", () => {
  it("switches between card and row view without changing search data", () => {
    renderPage();

    const cardsButton =
      screen.getByRole(
        "button",
        { name: "Cards" }
      );

    const rowsButton =
      screen.getByRole(
        "button",
        { name: "Rows" }
      );

    expect(cardsButton).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    expect(rowsButton).toHaveAttribute(
      "aria-pressed",
      "false"
    );

    fireEvent.click(rowsButton);

    expect(cardsButton).toHaveAttribute(
      "aria-pressed",
      "false"
    );

    expect(rowsButton).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("renders result cards inside the card grid", () => {
    renderPage([
      {
        sdChildId:
          "IND-408820-0044",
        firstName: "Ananya",
        gender: "F",
        ageInYears: 7,
        country: "India",
        status: "Available",
        isAvailable: true,
      },
    ]);

    expect(
      document.querySelector(
        ".search-results__grid"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("Ananya")
    ).toBeInTheDocument();
  });
});