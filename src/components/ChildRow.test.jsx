import {
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
} from "vitest";

import ChildRow from "./ChildRow";

const child = {
  sdChildId: "PHL-203415-0088",
  firstName: "Maria",
  gender: "F",
  ageInYears: 10,
  country: "Philippines",
  status: "Available",
  isAvailable: true,
};

describe("ChildRow", () => {
  it("renders the compact row fields and links to details", () => {
    render(
      <MemoryRouter>
        <ChildRow child={child} />
      </MemoryRouter>
    );

    const link =
      screen.getByRole("link");

    expect(link).toHaveAttribute(
      "href",
      "/children/PHL-203415-0088"
    );

    expect(
      screen.getByText("Maria")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Female")
    ).toBeInTheDocument();

    expect(
      screen.getByText("10")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Philippines")
    ).toBeInTheDocument();
  });

  it("keeps unavailable children available for detail inspection", () => {
    render(
      <MemoryRouter>
        <ChildRow
          child={{
            ...child,
            status: "Reserved",
            isAvailable: false,
          }}
        />
      </MemoryRouter>
    );

    const link =
      screen.getByRole("link");

    expect(link).toHaveClass(
      "child-row--unavailable"
    );

    expect(
      screen.getByText("Reserved")
    ).toBeInTheDocument();
  });
});
