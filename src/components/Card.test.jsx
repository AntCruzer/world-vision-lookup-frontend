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

import Card from "./Card";

const availableChild = {
  sdChildId: "KEN-123",
  greetingPhoto: null,
  firstName: "Maria",
  gender: "F",
  ageInYears: 9,
  country: "Kenya",
  status: "Available",
  isAvailable: true,
};

describe("Card", () => {
  it("links an available child to the detail page", () => {
    render(
      <MemoryRouter>
        <Card
          child={availableChild}
        />
      </MemoryRouter>
    );

    const link =
      screen.getByRole("link");

    expect(link).toHaveAttribute(
      "href",
      "/children/KEN-123"
    );

    expect(
      screen.getByText("Maria")
    ).toBeInTheDocument();

    expect(
      screen.getByText("KEN-123")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Available")
    ).toBeInTheDocument();
  });

  it("keeps an unavailable child accessible to the detail page", () => {
    const unavailableChild = {
      ...availableChild,
      status: "Sponsored",
      isAvailable: false,
    };

    render(
      <MemoryRouter>
        <Card
          child={
            unavailableChild
          }
        />
      </MemoryRouter>
    );

    const link =
      screen.getByRole("link");

    expect(link).toHaveAttribute(
      "href",
      "/children/KEN-123"
    );

    expect(link).toHaveClass(
      "child-card--unavailable"
    );

    expect(
      screen.getByText(
        "This child is not currently available."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Sponsored"
      )
    ).toBeInTheDocument();
  });

  it("handles a sparse child record without showing a photo", () => {
    const sparseChild = {
      sdChildId: "TZA-456",
      greetingPhoto: null,
      firstName: "Neema",
      gender: "F",
      ageInYears: null,
      country: null,
      status: "Available",
      isAvailable: true,
    };

    render(
      <MemoryRouter>
        <Card
          child={sparseChild}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Neema")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "TZA-456"
      )
    ).toBeInTheDocument();

    expect(
      screen.queryByText(
        "No photo"
      )
    ).not.toBeInTheDocument();

    expect(
      screen.getAllByText("—")
    ).toHaveLength(2);
  });
});
