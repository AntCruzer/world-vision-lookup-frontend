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

import Search from "./Search";

const defaultSearchParams = {
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

function renderSearch(
  overrides = {}
) {
  const props = {
    searchParams:
      defaultSearchParams,

    onFiltersChange:
      vi.fn(),

    regions: [
      {
        code: "EAR",
        label: "East Africa",
      },
    ],

    countryOptions: [
      {
        code: "KEN",
        label: "Kenya",
      },
      {
        code: "TZA",
        label:
          "United Republic of Tanzania",
      },
    ],

    selectedRegion: "",

    onRegionChange:
      vi.fn(),

    lookupLoading: false,

    lookupError: null,

    ...overrides,
  };

  render(
    <Search {...props} />
  );

  return props;
}

describe("Search", () => {
  it("sends supported gender values", () => {
    const props =
      renderSearch();

    fireEvent.change(
      screen.getByLabelText(
        "Gender"
      ),
      {
        target: {
          value: "F",
        },
      }
    );

    expect(
      props.onFiltersChange
    ).toHaveBeenCalledWith({
      gender: "F",
    });
  });

  it("sends supported sort values", () => {
    const props =
      renderSearch();

    fireEvent.change(
      screen.getByLabelText(
        "Sort by"
      ),
      {
        target: {
          value: "Age",
        },
      }
    );

    expect(
      props.onFiltersChange
    ).toHaveBeenCalledWith({
      sortBy: "Age",
    });
  });

  it("handles the has-photo filter", () => {
    const props =
      renderSearch();

    fireEvent.click(
      screen.getByLabelText(
        "Has photo"
      )
    );

    expect(
      props.onFiltersChange
    ).toHaveBeenCalledWith({
      hasPhoto: true,
    });
  });

  it("uses region only to narrow the country picker", () => {
    const props =
      renderSearch();

    fireEvent.change(
      screen.getByLabelText(
        "Region"
      ),
      {
        target: {
          value: "EAR",
        },
      }
    );

    expect(
      props.onRegionChange
    ).toHaveBeenCalledWith(
      "EAR"
    );

    expect(
      props.onFiltersChange
    ).not.toHaveBeenCalledWith({
      region: "EAR",
    });
  });

  it("shows country labels supplied by the lookup API", () => {
    renderSearch();

    expect(
      screen.getByRole(
        "option",
        {
          name: "Kenya",
        }
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole(
        "option",
        {
          name:
            "United Republic of Tanzania",
        }
      )
    ).toBeInTheDocument();
  });

  it("keeps Project ID numeric without using a number spinner", () => {
    const props =
      renderSearch();

    const projectInput =
      screen.getByLabelText(
        "Project ID"
      );

    expect(projectInput).toHaveAttribute(
      "type",
      "text"
    );

    expect(projectInput).toHaveAttribute(
      "inputmode",
      "numeric"
    );

    fireEvent.change(
      projectInput,
      {
        target: {
          value: "20A34-15",
        },
      }
    );

    expect(
      props.onFiltersChange
    ).toHaveBeenCalledWith({
      projectId: "203415",
    });
  });
});
