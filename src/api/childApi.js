async function readJsonResponse(
  response,
  errorMessage
) {
  if (!response.ok) {
    let responseBody = null;

    try {
      responseBody =
        await response.json();
    } catch {
      // Some failures may not
      // contain JSON.
    }

    const error =
      new Error(errorMessage);

    error.status =
      response.status;

    error.responseBody =
      responseBody;

    throw error;
  }

  return response.json();
}

export async function searchChildren(
  params = {},
  options = {}
) {
  const query =
    new URLSearchParams();

  Object.entries(params).forEach(
    ([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        return;
      }

      if (
        Array.isArray(value) &&
        value.length === 0
      ) {
        return;
      }

      if (
        key === "countries" &&
        Array.isArray(value)
      ) {
        query.set(
          "countries",
          value.join(",")
        );

        return;
      }

      if (Array.isArray(value)) {
        value.forEach((item) => {
          query.append(key, item);
        });

        return;
      }

      query.set(
        key,
        String(value)
      );
    }
  );

  const queryString =
    query.toString();

  const url = queryString
    ? `/api/v1/children/search?${queryString}`
    : "/api/v1/children/search";

  const headers = {};

  if (options.mockScenario) {
    headers["x-mock-scenario"] =
      options.mockScenario;
  }

  const response =
    await fetch(url, {
      signal: options.signal,
      headers,
    });

  return readJsonResponse(
    response,
    `Child search failed with status ${response.status}`
  );
}

export async function getCountries(
  regionCode = ""
) {
  const query =
    new URLSearchParams();

  if (regionCode) {
    query.set(
      "regionCode",
      regionCode
    );
  }

  const queryString =
    query.toString();

  const url = queryString
    ? `/api/v1/countries?${queryString}`
    : "/api/v1/countries";

  const response =
    await fetch(url);

  return readJsonResponse(
    response,
    `Country lookup failed with status ${response.status}`
  );
}

export async function getRegions() {
  const response =
    await fetch(
      "/api/v1/regions"
    );

  return readJsonResponse(
    response,
    `Region lookup failed with status ${response.status}`
  );
}