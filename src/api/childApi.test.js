import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  searchChildren,
  getCountries,
  getRegions,
} from "./childApi";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("searchChildren", () => {
  it("builds the documented search query", async () => {
    const responseBody = {
      items: [],
      page: 1,
      pageSize: 10,
      hasNextPage: false,
    };

    const fetchMock = vi.fn()
      .mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn()
          .mockResolvedValue(
            responseBody
          ),
      });

    vi.stubGlobal(
      "fetch",
      fetchMock
    );

    const result =
      await searchChildren({
        scope: "Available",
        countries: [
          "KEN",
          "TZA",
        ],
        minAge: 6,
        maxAge: 12,
        gender: "F",
        projectId: "",
        hasPhoto: true,
        sortBy: "Age",
        language: "en",
        pageNumber: 1,
        pageSize: 10,
      });

    expect(result).toEqual(
      responseBody
    );

    expect(fetchMock)
      .toHaveBeenCalledTimes(1);

    const [
      requestUrl,
    ] = fetchMock.mock.calls[0];

    const url = new URL(
      requestUrl,
      "http://localhost"
    );

    expect(url.pathname).toBe(
      "/api/v1/children/search"
    );

    expect(
      url.searchParams.get("scope")
    ).toBe("Available");

    expect(
      url.searchParams.get(
        "countries"
      )
    ).toBe("KEN,TZA");

    expect(
      url.searchParams.get("minAge")
    ).toBe("6");

    expect(
      url.searchParams.get("maxAge")
    ).toBe("12");

    expect(
      url.searchParams.get("gender")
    ).toBe("F");

    expect(
      url.searchParams.get(
        "hasPhoto"
      )
    ).toBe("true");

    expect(
      url.searchParams.get("sortBy")
    ).toBe("Age");

    expect(
      url.searchParams.get(
        "language"
      )
    ).toBe("en");

    expect(
      url.searchParams.get(
        "pageNumber"
      )
    ).toBe("1");

    expect(
      url.searchParams.get(
        "pageSize"
      )
    ).toBe("10");

    // Empty values should not be sent.
    expect(
      url.searchParams.has(
        "projectId"
      )
    ).toBe(false);
  });

  it("adds the mock scenario header when requested", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn()
          .mockResolvedValue({
            items: [],
            page: 1,
            pageSize: 10,
            hasNextPage: false,
          }),
      });

    vi.stubGlobal(
      "fetch",
      fetchMock
    );

    await searchChildren(
      {},
      {
        mockScenario: "empty",
      }
    );

    const [
      ,
      options,
    ] = fetchMock.mock.calls[0];

    expect(
      options.headers[
        "x-mock-scenario"
      ]
    ).toBe("empty");
  });

  it("keeps API validation information on a 400 error", async () => {
    const errorBody = {
      errors: [
        {
          propertyName:
            "MinAge",
          errorMessage:
            "Minimum age is invalid.",
        },
      ],
    };

    const fetchMock = vi.fn()
      .mockResolvedValue({
        ok: false,
        status: 400,
        json: vi.fn()
          .mockResolvedValue(
            errorBody
          ),
      });

    vi.stubGlobal(
      "fetch",
      fetchMock
    );

    try {
      await searchChildren({
        minAge: 17,
      });

      throw new Error(
        "Expected searchChildren to throw"
      );
    } catch (error) {
      expect(error.status)
        .toBe(400);

      expect(
        error.responseBody
      ).toEqual(errorBody);
    }
  });

  it("handles an error response with no JSON body", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValue({
        ok: false,
        status: 401,
        json: vi.fn()
          .mockRejectedValue(
            new SyntaxError(
              "No JSON body"
            )
          ),
      });

    vi.stubGlobal(
      "fetch",
      fetchMock
    );

    try {
      await searchChildren();

      throw new Error(
        "Expected searchChildren to throw"
      );
    } catch (error) {
      expect(error.status)
        .toBe(401);

      expect(
        error.responseBody
      ).toBeNull();
    }
  });
});

describe("lookup API functions", () => {
  it("requests countries for a selected region", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn()
          .mockResolvedValue([]),
      });

    vi.stubGlobal(
      "fetch",
      fetchMock
    );

    await getCountries("EAR");

    const [
      requestUrl,
    ] = fetchMock.mock.calls[0];

    const url = new URL(
      requestUrl,
      "http://localhost"
    );

    expect(url.pathname).toBe(
      "/api/v1/countries"
    );

    expect(
      url.searchParams.get(
        "regionCode"
      )
    ).toBe("EAR");
  });

  it("requests the regions lookup endpoint", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn()
          .mockResolvedValue([]),
      });

    vi.stubGlobal(
      "fetch",
      fetchMock
    );

    await getRegions();

    expect(fetchMock)
      .toHaveBeenCalledWith(
        "/api/v1/regions"
      );
  });
});