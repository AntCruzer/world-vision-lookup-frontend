import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  exportChildCsv,
} from "../utils/exportChildCsv";

import ChildDetailed from "./ChildDetailed";

vi.mock(
  "../utils/exportChildCsv",
  () => ({
    exportChildCsv: vi.fn(),
  })
);

const child = {
  sdChildId:
    "IND-408820-0044",
  projectId: 408820,
  firstName: "Ananya",
  gender: "F",
  ageInYears: 7,
  birthDay: 17,
  birthMonth: 1,
  countryCode: "IND",
  country: "India",
  greetingPhoto:
    "https://media.example.org/ananya.jpg",
  greetingVideo: null,
  favouriteActivity:
    "Jackstones",
  favouriteSubject:
    "Colouring",
  chore:
    "Cares for animals",
  grade: "2",
  schoolLevel:
    "Primary school",
  livesWith: "Parents",
  numberOfBrothers: 1,
  numberOfSisters: 0,
  status: "Available",
  isAvailable: true,
};

describe("ChildDetailed", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("keeps the child photo on the detail view", () => {
    render(
      <ChildDetailed
        child={child}
      />
    );

    expect(
      screen.getByRole("img", {
        name: "Photo of Ananya",
      })
    ).toBeInTheDocument();
  });

  it("exports the current child as CSV", () => {
    render(
      <ChildDetailed
        child={child}
      />
    );

    fireEvent.click(
      screen.getByRole(
        "button",
        {
          name: "Export CSV",
        }
      )
    );

    expect(
      exportChildCsv
    ).toHaveBeenCalledWith(
      child
    );
  });

  it("preserves zero sibling counts", () => {
    render(
      <ChildDetailed
        child={child}
      />
    );

    expect(
      screen.getByText("Sisters")
    ).toBeInTheDocument();

    expect(
      screen.getByText("0")
    ).toBeInTheDocument();
  });
});
