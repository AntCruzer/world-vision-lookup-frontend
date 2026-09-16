import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createChildCsv,
} from "./exportChildCsv";

const child = {
  sdChildId:
    "PHL-203415-0088",
  projectId: 203415,
  firstName: "Maria",
  gender: "F",
  ageInYears: 10,
  birthDay: 2,
  birthMonth: 11,
  countryCode: "PHL",
  country: "Philippines",
  status: "Available",
  isAvailable: true,
  favouriteActivity:
    "Ball games",
  favouriteSubject:
    "Colouring",
  chore: "Runs errands",
  schoolLevel:
    "Primary school",
  grade: "5",
  livesWith: "Mother only",
  numberOfBrothers: 0,
  numberOfSisters: 3,
  greetingPhoto: null,
  greetingVideo: null,
};

describe("createChildCsv", () => {
  it("exports supported child fields and preserves zero values", () => {
    const csv =
      createChildCsv(child);

    expect(csv).toContain(
      "Child ID,PHL-203415-0088"
    );

    expect(csv).toContain(
      "Gender,Female"
    );

    expect(csv).toContain(
      "Available,Yes"
    );

    expect(csv).toContain(
      "Number of Brothers,0"
    );

    expect(csv).toContain(
      "Greeting Photo URL,"
    );
  });

  it("escapes commas and quotes for CSV", () => {
    const csv =
      createChildCsv({
        ...child,
        favouriteActivity:
          'Drawing, reading "books"',
      });

    expect(csv).toContain(
      'Favourite Activity,"Drawing, reading ""books"""'
    );
  });

  it("neutralizes spreadsheet formulas in text fields", () => {
    const csv =
      createChildCsv({
        ...child,
        grade: "=2+2",
      });

    expect(csv).toContain(
      "Grade,'=2+2"
    );
  });
});
