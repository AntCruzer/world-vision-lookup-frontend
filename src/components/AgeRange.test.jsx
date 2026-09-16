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

import AgeRange, {
  AGE_RANGE_MAX,
  AGE_RANGE_MIN,
} from "./AgeRange";

describe("AgeRange", () => {
  it("starts as unrestricted when no ages are supplied", () => {
    render(
      <AgeRange
        minAge=""
        maxAge=""
        onChange={vi.fn()}
      />
    );

    expect(
      screen.getByText(
        "Any age"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(
        "Minimum age"
      )
    ).toHaveValue(
      String(AGE_RANGE_MIN)
    );

    expect(
      screen.getByLabelText(
        "Maximum age"
      )
    ).toHaveValue(
      String(AGE_RANGE_MAX)
    );
  });

  it("updates the minimum age", () => {
    const onChange =
      vi.fn();

    render(
      <AgeRange
        minAge=""
        maxAge=""
        onChange={onChange}
      />
    );

    fireEvent.change(
      screen.getByLabelText(
        "Minimum age"
      ),
      {
        target: {
          value: "6",
        },
      }
    );

    expect(onChange)
      .toHaveBeenCalledWith({
        minAge: "6",
        maxAge: String(
          AGE_RANGE_MAX
        ),
      });
  });

  it("updates the maximum age", () => {
    const onChange =
      vi.fn();

    render(
      <AgeRange
        minAge=""
        maxAge=""
        onChange={onChange}
      />
    );

    fireEvent.change(
      screen.getByLabelText(
        "Maximum age"
      ),
      {
        target: {
          value: "12",
        },
      }
    );

    expect(onChange)
      .toHaveBeenCalledWith({
        minAge: String(
          AGE_RANGE_MIN
        ),
        maxAge: "12",
      });
  });

  it("does not allow minimum age to exceed maximum age", () => {
    const onChange =
      vi.fn();

    render(
      <AgeRange
        minAge="6"
        maxAge="12"
        onChange={onChange}
      />
    );

    /*
     * fireEvent can provide a value
     * outside the element's HTML max,
     * so this also verifies the
     * component's JavaScript guard.
     */
    fireEvent.change(
      screen.getByLabelText(
        "Minimum age"
      ),
      {
        target: {
          value: "15",
        },
      }
    );

    expect(onChange)
      .toHaveBeenCalledWith({
        minAge: "12",
        maxAge: "12",
      });
  });

  it("does not allow maximum age to go below minimum age", () => {
    const onChange =
      vi.fn();

    render(
      <AgeRange
        minAge="6"
        maxAge="12"
        onChange={onChange}
      />
    );

    fireEvent.change(
      screen.getByLabelText(
        "Maximum age"
      ),
      {
        target: {
          value: "3",
        },
      }
    );

    expect(onChange)
      .toHaveBeenCalledWith({
        minAge: "6",
        maxAge: "6",
      });
  });

  it("shows the selected age range", () => {
    render(
      <AgeRange
        minAge="6"
        maxAge="12"
        onChange={vi.fn()}
      />
    );

    expect(
      screen.getByText(
        "6–12 years"
      )
    ).toBeInTheDocument();
  });

  it("can clear the age filter", () => {
    const onChange =
      vi.fn();

    render(
      <AgeRange
        minAge="6"
        maxAge="12"
        onChange={onChange}
      />
    );

    fireEvent.click(
      screen.getByRole(
        "button",
        {
          name:
            "Clear age range",
        }
      )
    );

    expect(onChange)
      .toHaveBeenCalledWith({
        minAge: "",
        maxAge: "",
      });
  });

  it("does not show the clear button when no age filter is active", () => {
    render(
      <AgeRange
        minAge=""
        maxAge=""
        onChange={vi.fn()}
      />
    );

    expect(
      screen.queryByRole(
        "button",
        {
          name:
            "Clear age range",
        }
      )
    ).not.toBeInTheDocument();
  });
});