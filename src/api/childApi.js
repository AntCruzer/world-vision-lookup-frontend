export const BENEFICIARY_API_BASE_URL =
  (
    import.meta.env
      .VITE_BENEFICIARY_API_BASE_URL ||
    "/api/v1"
  ).replace(/\/+$/, "");

function buildApiUrl(path) {
  const normalizedPath =
    path.replace(/^\/+/, "");

  return `${BENEFICIARY_API_BASE_URL}/${normalizedPath}`;
}

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

  const endpoint =
    buildApiUrl(
      "children/search"
    );

  const url = queryString
    ? `${endpoint}?${queryString}`
    : endpoint;

  const response =
    await fetch(url, {
      signal: options.signal,
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

  const endpoint =
    buildApiUrl("countries");

  const url = queryString
    ? `${endpoint}?${queryString}`
    : endpoint;

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
      buildApiUrl("regions")
    );

  return readJsonResponse(
    response,
    `Region lookup failed with status ${response.status}`
  );
}