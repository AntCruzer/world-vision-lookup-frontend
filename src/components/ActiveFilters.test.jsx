import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import ActiveFilters from "./ActiveFilters";

const defaultSearchParams = {
  scope: "Available",
  countries: [],
  minAge: "",
  maxAge: "",
  gender: "",
  projectId: "",
  birthMonth: "",
  birthDay: "",
  hasPhoto: "",
  sortBy: "SdChildId",
  language: "en",
};

function renderFilters(
  overrides = {}
) {
  const props = {
    searchParams: {
      ...defaultSearchParams,
      countries: ["IND"],
      gender: "F",
      minAge: "6",
      maxAge: "12",
    },
    regions: [
      {
        code: "SAP",
        label:
          "South Asia and Pacific",
      },
    ],
    countryOptions: [
      {
        code: "IND",
        label: "India",
      },
    ],
    selectedRegion: "",
    onFiltersChange: vi.fn(),
    onRegionChange: vi.fn(),
    onResetFilters: vi.fn(),
    ...overrides,
  };

  render(
    <ActiveFilters
      {...props}
    />
  );

  return props;
}

describe("ActiveFilters", () => {
  it("does not render when no filter is active", () => {
    renderFilters({
      searchParams:
        defaultSearchParams,
    });

    expect(
      screen.queryByLabelText(
        "Active filters"
      )
    ).not.toBeInTheDocument();
  });

  it("shows readable chips for active filters", () => {
    renderFilters();

    expect(
      screen.getByText(
        "Country: India"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Gender: Female"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Age: 6–12 years"
      )
    ).toBeInTheDocument();
  });

  it("removes only the selected country", () => {
    const props =
      renderFilters({
        searchParams: {
          ...defaultSearchParams,
          countries: [
            "IND",
            "KEN",
          ],
        },
        countryOptions: [
          {
            code: "IND",
            label: "India",
          },
          {
            code: "KEN",
            label: "Kenya",
          },
        ],
      });

    fireEvent.click(
      screen.getByRole(
        "button",
        {
          name:
            "Remove Country: India filter",
        }
      )
    );

    expect(
      props.onFiltersChange
    ).toHaveBeenCalledWith({
      countries: ["KEN"],
    });
  });

  it("uses the shared reset handler for Clear all filters", () => {
    const props =
      renderFilters();

    fireEvent.click(
      screen.getByRole(
        "button",
        {
          name:
            "Clear all filters",
        }
      )
    );

    expect(
      props.onResetFilters
    ).toHaveBeenCalledTimes(1);
  });
});
