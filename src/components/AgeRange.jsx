import "./AgeRange.css";

export const AGE_RANGE_MIN = 0;

/*
 * The API requires ages to be >= 0,
 * but does not specify an upper bound.
 *
 * The supplied fixtures/examples exercise
 * ages through 18, so 18 is currently used
 * as the UI ceiling.
 */
export const AGE_RANGE_MAX = 18;

function clamp(
  value,
  minimum,
  maximum
) {
  return Math.min(
    Math.max(value, minimum),
    maximum
  );
}

function AgeRange({
  minAge,
  maxAge,
  onChange,
}) {
  const hasMinAge =
    minAge !== "" &&
    minAge !== null &&
    minAge !== undefined;

  const hasMaxAge =
    maxAge !== "" &&
    maxAge !== null &&
    maxAge !== undefined;

  const hasAgeFilter =
    hasMinAge || hasMaxAge;

  const currentMin =
    hasMinAge
      ? clamp(
          Number(minAge),
          AGE_RANGE_MIN,
          AGE_RANGE_MAX
        )
      : AGE_RANGE_MIN;

  const currentMax =
    hasMaxAge
      ? clamp(
          Number(maxAge),
          AGE_RANGE_MIN,
          AGE_RANGE_MAX
        )
      : AGE_RANGE_MAX;

  /*
   * Convert values to percentages so
   * the highlighted portion of the
   * track can be positioned correctly.
   */
  const rangeSize =
    AGE_RANGE_MAX -
    AGE_RANGE_MIN;

  const minPercent =
    ((currentMin -
      AGE_RANGE_MIN) /
      rangeSize) *
    100;

  const maxPercent =
    ((currentMax -
      AGE_RANGE_MIN) /
      rangeSize) *
    100;

  function handleMinChange(event) {
    const requestedMin =
      Number(event.target.value);

    /*
     * Minimum may move anywhere from
     * AGE_RANGE_MIN up to currentMax,
     * but never beyond currentMax.
     */
    const nextMin =
      Math.min(
        requestedMin,
        currentMax
      );

    onChange({
      minAge: String(nextMin),
      maxAge: String(currentMax),
    });
  }

  function handleMaxChange(event) {
    const requestedMax =
      Number(event.target.value);

    /*
     * Maximum may move anywhere from
     * currentMin through AGE_RANGE_MAX,
     * but never below currentMin.
     */
    const nextMax =
      Math.max(
        requestedMax,
        currentMin
      );

    onChange({
      minAge: String(currentMin),
      maxAge: String(nextMax),
    });
  }

  function handleClear() {
    onChange({
      minAge: "",
      maxAge: "",
    });
  }

  function getRangeLabel() {
    if (!hasAgeFilter) {
      return "Any age";
    }

    if (
      currentMin === currentMax
    ) {
      return `${currentMin} years`;
    }

    return `${currentMin}–${currentMax} years`;
  }

  return (
    <div className="age-range child-search__field">
      <div className="age-range__heading">
        <span className="age-range__label">
          Age range
        </span>

        <span
          className="age-range__summary"
          aria-live="polite"
        >
          {getRangeLabel()}
        </span>
      </div>

      <div
        className="age-range__sliders"
        style={{
          "--age-range-start":
            `${minPercent}%`,

          "--age-range-end":
            `${maxPercent}%`,
        }}
      >
        <div
          className="age-range__track"
          aria-hidden="true"
        >
          <div className="age-range__track-selected" />
        </div>

        {/* Minimum handle */}
        <input
          className="age-range__slider age-range__slider--minimum"
          type="range"
          min={AGE_RANGE_MIN}
          max={AGE_RANGE_MAX}
          step="1"
          value={currentMin}
          aria-label="Minimum age"
          aria-valuemin={
            AGE_RANGE_MIN
          }
          aria-valuemax={
            currentMax
          }
          aria-valuenow={
            currentMin
          }
          aria-valuetext={
            `${currentMin} years`
          }
          onChange={
            handleMinChange
          }
        />

        {/* Maximum handle */}
        <input
          className="age-range__slider age-range__slider--maximum"
          type="range"
          min={AGE_RANGE_MIN}
          max={AGE_RANGE_MAX}
          step="1"
          value={currentMax}
          aria-label="Maximum age"
          aria-valuemin={
            currentMin
          }
          aria-valuemax={
            AGE_RANGE_MAX
          }
          aria-valuenow={
            currentMax
          }
          aria-valuetext={
            `${currentMax} years`
          }
          onChange={
            handleMaxChange
          }
        />
      </div>

      <div className="age-range__limits">
        <span>
          {AGE_RANGE_MIN}
        </span>

        <span>
          {AGE_RANGE_MAX}
        </span>
      </div>

      <div className="age-range__values">
        <span>
          Minimum:{" "}
          <strong>
            {currentMin}
          </strong>
        </span>

        <span>
          Maximum:{" "}
          <strong>
            {currentMax}
          </strong>
        </span>
      </div>

      {hasAgeFilter && (
        <button
          type="button"
          className="age-range__clear"
          onClick={handleClear}
        >
          Clear age range
        </button>
      )}
    </div>
  );
}

export default AgeRange;