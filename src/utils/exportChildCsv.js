function formatGender(gender) {
  return (
    {
      M: "Male",
      F: "Female",
    }[gender] ?? gender ?? ""
  );
}

function formatAvailability(
  isAvailable
) {
  if (isAvailable === true) {
    return "Yes";
  }

  if (isAvailable === false) {
    return "No";
  }

  return "";
}

function normalizeValue(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value);
}

/*
 * Spreadsheet applications can treat cells beginning with
 * =, +, -, or @ as formulas. Prefixing those values with an
 * apostrophe keeps exported API text as text when opened in
 * Excel or another spreadsheet application.
 */
function protectSpreadsheetValue(
  value
) {
  const normalizedValue =
    normalizeValue(value);

  if (
    /^[\t\r ]*[=+\-@]/.test(
      normalizedValue
    )
  ) {
    return `'${normalizedValue}`;
  }

  return normalizedValue;
}

/*
 * CSV values must be quoted when they
 * contain commas, quotes, or line breaks.
 *
 * Existing double quotes are escaped by
 * doubling them.
 */
function escapeCsvValue(value) {
  const safeValue =
    protectSpreadsheetValue(
      value
    );

  if (
    safeValue.includes(",") ||
    safeValue.includes('"') ||
    safeValue.includes("\n") ||
    safeValue.includes("\r")
  ) {
    return `"${safeValue.replace(
      /"/g,
      '""'
    )}"`;
  }

  return safeValue;
}

function createSafeFileName(
  childId
) {
  const safeId =
    normalizeValue(childId)
      .trim()
      .replace(
        /[^a-zA-Z0-9_-]/g,
        "-"
      );

  return safeId || "child";
}

export function createChildCsv(
  child
) {
  const rows = [
    ["Field", "Value"],

    [
      "Child ID",
      child.sdChildId,
    ],

    [
      "Project ID",
      child.projectId,
    ],

    [
      "First Name",
      child.firstName,
    ],

    [
      "Gender",
      formatGender(
        child.gender
      ),
    ],

    [
      "Age",
      child.ageInYears,
    ],

    [
      "Birth Day",
      child.birthDay,
    ],

    [
      "Birth Month",
      child.birthMonth,
    ],

    [
      "Country Code",
      child.countryCode,
    ],

    [
      "Country",
      child.country,
    ],

    [
      "Status",
      child.status,
    ],

    [
      "Available",
      formatAvailability(
        child.isAvailable
      ),
    ],

    [
      "Favourite Activity",
      child.favouriteActivity,
    ],

    [
      "Favourite Subject",
      child.favouriteSubject,
    ],

    [
      "Chore",
      child.chore,
    ],

    [
      "School Level",
      child.schoolLevel,
    ],

    [
      "Grade",
      child.grade,
    ],

    [
      "Lives With",
      child.livesWith,
    ],

    [
      "Number of Brothers",
      child.numberOfBrothers,
    ],

    [
      "Number of Sisters",
      child.numberOfSisters,
    ],

    [
      "Greeting Photo URL",
      child.greetingPhoto,
    ],

    [
      "Greeting Video URL",
      child.greetingVideo,
    ],
  ];

  return rows
    .map((row) =>
      row
        .map(escapeCsvValue)
        .join(",")
    )
    .join("\r\n");
}

export function exportChildCsv(
  child
) {
  if (!child) {
    return;
  }

  const csv =
    createChildCsv(child);

  /*
   * The UTF-8 BOM helps Microsoft Excel
   * recognize the file encoding correctly.
   */
  const csvWithBom =
    `\uFEFF${csv}`;

  const blob = new Blob(
    [csvWithBom],
    {
      type:
        "text/csv;charset=utf-8;",
    }
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    `child-${createSafeFileName(
      child.sdChildId
    )}.csv`;

  document.body.appendChild(
    link
  );

  link.click();

  document.body.removeChild(
    link
  );

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 0);
}
