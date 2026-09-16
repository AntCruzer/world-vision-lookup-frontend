import {
  http,
  HttpResponse,
  delay,
} from "msw";

import mock from "../data/child-search-mock.json";

const scenarios = mock.scenarios;

const FORCED_SEARCH_SCENARIOS =
  new Set([
    "defaultFirstPage",
    "filteredWithTotal",
    "scopeAllMixedStatuses",
    "french",
    "lastPage",
    "empty",
    "errorAgeRange",
    "errorBadScope",
    "errorMultiple",
  ]);

/*
 * Build a searchable English mock pool from
 * records that already exist in the supplied
 * fixture.
 *
 * Duplicate sdChildIds are removed.
 */
function buildEnglishSearchPool() {
  const sourceItems = [
    ...scenarios.defaultFirstPage.body.items,
    ...scenarios.filteredWithTotal.body.items,
    ...scenarios.scopeAllMixedStatuses.body.items,
    ...scenarios.lastPage.body.items,
  ];

  const uniqueChildren =
    new Map();

  sourceItems.forEach((child) => {
    if (
      !uniqueChildren.has(
        child.sdChildId
      )
    ) {
      uniqueChildren.set(
        child.sdChildId,
        child
      );
    }
  });

  return Array.from(
    uniqueChildren.values()
  );
}

const ENGLISH_SEARCH_POOL =
  buildEnglishSearchPool();

const VALID_COUNTRY_CODES =
  new Set(
    scenarios.countriesLookup.body.map(
      (country) => country.code
    )
  );

function sortItems(items, sortBy) {
  const sortedItems = [...items];

  if (sortBy === "Age") {
    return sortedItems.sort(
      (a, b) => {
        const ageA =
          a.ageInYears;

        const ageB =
          b.ageInYears;

        if (
          ageA === null &&
          ageB === null
        ) {
          return 0;
        }

        if (ageA === null) {
          return 1;
        }

        if (ageB === null) {
          return -1;
        }

        return ageA - ageB;
      }
    );
  }

  if (sortBy === "Country") {
    return sortedItems.sort(
      (a, b) => {
        const countryA =
          a.countryCode ?? "";

        const countryB =
          b.countryCode ?? "";

        return countryA.localeCompare(
          countryB
        );
      }
    );
  }

  return sortedItems.sort(
    (a, b) =>
      a.sdChildId.localeCompare(
        b.sdChildId
      )
  );
}

function getForcedSearchScenario(
  request
) {
  const scenarioName =
    request.headers.get(
      "x-mock-scenario"
    );

  if (
    !scenarioName ||
    !FORCED_SEARCH_SCENARIOS.has(
      scenarioName
    )
  ) {
    return null;
  }

  return scenarios[scenarioName];
}

/*
 * Supports both documented country formats:
 *
 * ?country=PHL&country=TZA
 *
 * and:
 *
 * ?countries=PHL,TZA
 */
function getCountryCodes(query) {
  const countryCodes = [];

  query
    .getAll("country")
    .forEach((value) => {
      value
        .split(",")
        .forEach((code) => {
          if (code.trim()) {
            countryCodes.push(
              code.trim().toUpperCase()
            );
          }
        });
    });

  query
    .getAll("countries")
    .forEach((value) => {
      value
        .split(",")
        .forEach((code) => {
          if (code.trim()) {
            countryCodes.push(
              code.trim().toUpperCase()
            );
          }
        });
    });

  return [
    ...new Set(countryCodes),
  ];
}

function parseInteger(value) {
  if (
    value === null ||
    value === ""
  ) {
    return null;
  }

  const parsed =
    Number(value);

  if (!Number.isInteger(parsed)) {
    return null;
  }

  return parsed;
}

function normalizeGender(value) {
  if (!value) {
    return "";
  }

  const normalized =
    value.toLowerCase();

  if (
    normalized === "f" ||
    normalized === "female"
  ) {
    return "F";
  }

  if (
    normalized === "m" ||
    normalized === "male"
  ) {
    return "M";
  }

  return null;
}

function getDaysInMonth(month) {
  const daysByMonth = {
    1: 31,
    2: 29,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31,
  };

  return (
    daysByMonth[month] ??
    null
  );
}

function validationResponse(
  errors
) {
  return HttpResponse.json(
    { errors },
    { status: 400 }
  );
}

function validateQuery(query) {
  const errors = [];

  const scope =
    query.get("scope");

  if (
    scope &&
    !["available", "all"].includes(
      scope.toLowerCase()
    )
  ) {
    errors.push({
      propertyName: "Scope",
      errorMessage:
        "Scope must be one of: Available, All.",
    });
  }

  const gender =
    query.get("gender");

  if (
    gender &&
    normalizeGender(gender) ===
      null
  ) {
    errors.push({
      propertyName: "Gender",
      errorMessage:
        "Gender must be one of: M, F, Male, Female.",
    });
  }

  const sortBy =
    query.get("sortBy");

  if (
    sortBy &&
    ![
      "SdChildId",
      "Age",
      "Country",
    ].includes(sortBy)
  ) {
    errors.push({
      propertyName: "SortBy",
      errorMessage:
        "SortBy must be one of: SdChildId, Age, Country.",
    });
  }

  const language =
    query.get("language");

  if (
    language &&
    !["en", "fr"].includes(
      language.toLowerCase()
    )
  ) {
    errors.push({
      propertyName: "Language",
      errorMessage:
        "Language must be one of: en, fr.",
    });
  }

  const countryCodes =
    getCountryCodes(query);

  countryCodes.forEach(
    (code) => {
      if (
        !VALID_COUNTRY_CODES.has(
          code
        )
      ) {
        errors.push({
          propertyName:
            "Countries",
          errorMessage:
            `Invalid country code '${code}'.`,
        });
      }
    }
  );

  const minAge =
    parseInteger(
      query.get("minAge")
    );

  const maxAge =
    parseInteger(
      query.get("maxAge")
    );

  if (
    minAge !== null &&
    minAge < 0
  ) {
    errors.push({
      propertyName: "MinAge",
      errorMessage:
        "MinAge must be zero or greater.",
    });
  }

  if (
    maxAge !== null &&
    maxAge < 0
  ) {
    errors.push({
      propertyName: "MaxAge",
      errorMessage:
        "MaxAge must be zero or greater.",
    });
  }

  if (
    minAge !== null &&
    maxAge !== null &&
    minAge > maxAge
  ) {
    return [
      {
        propertyName: "",
        errorMessage:
          "minAge must be less than or equal to maxAge",
      },
    ];
  }

  const birthMonth =
    parseInteger(
      query.get("birthMonth")
    );

  const birthDay =
    parseInteger(
      query.get("birthDay")
    );

  if (
    birthMonth !== null &&
    (
      birthMonth < 1 ||
      birthMonth > 12
    )
  ) {
    errors.push({
      propertyName:
        "BirthMonth",
      errorMessage:
        "BirthMonth must be between 1 and 12.",
    });
  }

  if (
    birthDay !== null &&
    (
      birthDay < 1 ||
      birthDay > 31
    )
  ) {
    errors.push({
      propertyName:
        "BirthDay",
      errorMessage:
        "BirthDay must be between 1 and 31.",
    });
  }

  if (
    birthMonth !== null &&
    birthDay !== null
  ) {
    const maxDay =
      getDaysInMonth(
        birthMonth
      );

    if (
      maxDay &&
      birthDay > maxDay
    ) {
      errors.push({
        propertyName: "",
        errorMessage:
          "The supplied birth month and day are invalid.",
      });
    }
  }

  const pageNumber =
    parseInteger(
      query.get("pageNumber")
    );

  if (
    pageNumber !== null &&
    pageNumber < 1
  ) {
    errors.push({
      propertyName:
        "PageNumber",
      errorMessage:
        "PageNumber must be greater than zero.",
    });
  }

  const pageSize =
    parseInteger(
      query.get("pageSize")
    );

  if (
    pageSize !== null &&
    (
      pageSize < 1 ||
      pageSize > 100
    )
  ) {
    errors.push({
      propertyName:
        "PageSize",
      errorMessage:
        "PageSize must be between 1 and 100.",
    });
  }

  return errors;
}

function filterItems(
  items,
  query
) {
  let filteredItems =
    [...items];

  /*
   * scope
   *
   * Available is the documented
   * default.
   */
  const scope =
    (
      query.get("scope") ??
      "Available"
    ).toLowerCase();

  if (
    scope === "available"
  ) {
    filteredItems =
      filteredItems.filter(
        (child) =>
          child.isAvailable ===
          true
      );
  }

  /*
   * countries
   */
  const countryCodes =
    getCountryCodes(query);

  if (
    countryCodes.length > 0
  ) {
    filteredItems =
      filteredItems.filter(
        (child) =>
          countryCodes.includes(
            child.countryCode
          )
      );
  }

  /*
   * age range
   */
  const minAge =
    parseInteger(
      query.get("minAge")
    );

  const maxAge =
    parseInteger(
      query.get("maxAge")
    );

  if (minAge !== null) {
    filteredItems =
      filteredItems.filter(
        (child) =>
          child.ageInYears !==
            null &&
          child.ageInYears >=
            minAge
      );
  }

  if (maxAge !== null) {
    filteredItems =
      filteredItems.filter(
        (child) =>
          child.ageInYears !==
            null &&
          child.ageInYears <=
            maxAge
      );
  }

  /*
   * gender
   */
  const gender =
    normalizeGender(
      query.get("gender")
    );

  if (gender) {
    filteredItems =
      filteredItems.filter(
        (child) =>
          child.gender === gender
      );
  }

  /*
   * projectId
   */
  const projectId =
    parseInteger(
      query.get("projectId")
    );

  if (projectId !== null) {
    filteredItems =
      filteredItems.filter(
        (child) =>
          child.projectId ===
          projectId
      );
  }

  /*
   * birthday
   */
  const birthDay =
    parseInteger(
      query.get("birthDay")
    );

  const birthMonth =
    parseInteger(
      query.get("birthMonth")
    );

  if (birthDay !== null) {
    filteredItems =
      filteredItems.filter(
        (child) =>
          child.birthDay ===
          birthDay
      );
  }

  if (birthMonth !== null) {
    filteredItems =
      filteredItems.filter(
        (child) =>
          child.birthMonth ===
          birthMonth
      );
  }

  /*
   * hasPhoto
   *
   * The current UI only exposes the true
   * state, but Automatic MSW mode still
   * honours both documented boolean values.
   */
  const hasPhoto =
    query.get("hasPhoto");

  if (hasPhoto === "true") {
  filteredItems =
    filteredItems.filter(
      (child) =>
        Boolean(
          child.greetingPhoto
        )
    );
}

if (hasPhoto === "false") {
  filteredItems =
    filteredItems.filter(
      (child) =>
        !child.greetingPhoto
    );
}

  return filteredItems;
}

export const handlers = [
  http.get(
    "*/api/v1/children/search",
    async ({ request }) => {
      await delay(700);

      /*
       * Forced development scenario.
       *
       * This takes precedence over
       * Automatic mode.
       */
      const forcedScenario =
        getForcedSearchScenario(
          request
        );

      if (forcedScenario) {
        return HttpResponse.json(
          forcedScenario.body,
          {
            status:
              forcedScenario.status,
          }
        );
      }

      const url =
        new URL(request.url);

      const query =
        url.searchParams;

      /*
       * Validate documented query
       * parameters.
       */
      const validationErrors =
        validateQuery(query);

      if (
        validationErrors.length >
        0
      ) {
        return validationResponse(
          validationErrors
        );
      }

      const language =
        (
          query.get("language") ??
          "en"
        ).toLowerCase();

      /*
       * The supplied fixture only
       * contains two French records,
       * so Automatic French mode can
       * only search that provided
       * French dataset.
       */
      const sourceItems =
        language === "fr"
          ? scenarios.french.body
              .items
          : ENGLISH_SEARCH_POOL;

      let filteredItems =
        filterItems(
          sourceItems,
          query
        );

      /*
       * Sorting
       */
      const sortBy =
        query.get("sortBy") ??
        "SdChildId";

      filteredItems =
        sortItems(
          filteredItems,
          sortBy
        );

      /*
       * Pagination
       */
      const pageNumber =
        parseInteger(
          query.get(
            "pageNumber"
          )
        ) ?? 1;

      const pageSize =
        parseInteger(
          query.get(
            "pageSize"
          )
        ) ?? 10;

      const startIndex =
        (pageNumber - 1) *
        pageSize;

      const endIndex =
        startIndex + pageSize;

      const pageItems =
        filteredItems.slice(
          startIndex,
          endIndex
        );

      const responseBody = {
        items: pageItems,
        page: pageNumber,
        pageSize,
        hasNextPage:
          endIndex <
          filteredItems.length,
      };

      /*
       * total must only appear when
       * includeTotal=true.
       */
      if (
        query.get(
          "includeTotal"
        ) === "true"
      ) {
        responseBody.total =
          filteredItems.length;
      }

      return HttpResponse.json(
        responseBody
      );
    }
  ),

  /*
   * Countries lookup
   */
  http.get(
    "*/api/v1/countries",
    async ({ request }) => {
      await delay(300);

      const url =
        new URL(request.url);

      const regionCode =
        url.searchParams.get(
          "regionCode"
        );

      const countries =
        regionCode
          ? scenarios
              .countriesLookup
              .body
              .filter(
                (country) =>
                  country.regionCode ===
                  regionCode
              )
          : scenarios
              .countriesLookup
              .body;

      return HttpResponse.json(
        countries
      );
    }
  ),

  /*
   * Regions lookup
   */
  http.get(
    "*/api/v1/regions",
    async () => {
      await delay(300);

      return HttpResponse.json(
        scenarios.regionsLookup
          .body
      );
    }
  ),
];