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

import Pagination from "./Pagination";

describe("Pagination", () => {
  it("disables Previous on page 1", () => {
    render(
      <Pagination
        page={1}
        pageSize={10}
        hasNextPage={true}
        total={undefined}
        loading={false}
        onPrevious={vi.fn()}
        onNext={vi.fn()}
      />
    );

    expect(
      screen.getByRole(
        "button",
        {
          name: "Previous",
        }
      )
    ).toBeDisabled();

    expect(
      screen.getByRole(
        "button",
        {
          name: "Next",
        }
      )
    ).toBeEnabled();
  });

  it("disables Next on the last page", () => {
    render(
      <Pagination
        page={4}
        pageSize={10}
        hasNextPage={false}
        total={32}
        loading={false}
        onPrevious={vi.fn()}
        onNext={vi.fn()}
      />
    );

    expect(
      screen.getByText(
        "Page 4"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "32 children found"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole(
        "button",
        {
          name: "Next",
        }
      )
    ).toBeDisabled();
  });

  it("calls the page handlers", () => {
    const onPrevious =
      vi.fn();

    const onNext =
      vi.fn();

    render(
      <Pagination
        page={2}
        pageSize={10}
        hasNextPage={true}
        total={undefined}
        loading={false}
        onPrevious={
          onPrevious
        }
        onNext={onNext}
      />
    );

    fireEvent.click(
      screen.getByRole(
        "button",
        {
          name: "Previous",
        }
      )
    );

    fireEvent.click(
      screen.getByRole(
        "button",
        {
          name: "Next",
        }
      )
    );

    expect(onPrevious)
      .toHaveBeenCalledTimes(1);

    expect(onNext)
      .toHaveBeenCalledTimes(1);
  });

  it("disables navigation while loading", () => {
    render(
      <Pagination
        page={2}
        pageSize={10}
        hasNextPage={true}
        total={undefined}
        loading={true}
        onPrevious={vi.fn()}
        onNext={vi.fn()}
      />
    );

    expect(
      screen.getByRole(
        "button",
        {
          name: "Previous",
        }
      )
    ).toBeDisabled();

    expect(
      screen.getByRole(
        "button",
        {
          name: "Next",
        }
      )
    ).toBeDisabled();
  });
});