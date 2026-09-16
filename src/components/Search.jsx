import "./Search.css";
import AgeRange from "./AgeRange";

const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

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

  return daysByMonth[month] ?? 31;
}

function Search({
  searchParams,
  onFiltersChange,
  regions,
  countryOptions,
  selectedRegion,
  onRegionChange,
  lookupLoading,
  lookupError,
}) {
  const {
    scope,
    countries,
    minAge,
    maxAge,
    gender,
    projectId,
    birthDay,
    birthMonth,
    hasPhoto,
    sortBy,
    language,
  } = searchParams;

  const numberOfBirthdayDays =
    getDaysInMonth(birthMonth);

  const birthdayDays = Array.from(
    {
      length: numberOfBirthdayDays,
    },
    (_, index) => index + 1
  );

  function handleCountryChange(event) {
    const selectedCountries =
      Array.from(
        event.target.selectedOptions,
        (option) => option.value
      );

    onFiltersChange({
      countries: selectedCountries,
    });
  }

  function handleBirthMonthChange(event) {
    const newMonth =
      event.target.value;

    if (newMonth === "") {
      onFiltersChange({
        birthMonth: "",
        birthDay: "",
      });

      return;
    }

    const maxDay =
      getDaysInMonth(newMonth);

    const adjustedDay =
      birthDay !== "" &&
      Number(birthDay) > maxDay
        ? String(maxDay)
        : birthDay;

    onFiltersChange({
      birthMonth: newMonth,
      birthDay: adjustedDay,
    });
  }

  function handleProjectIdChange(event) {
    const numericValue =
      event.target.value.replace(
        /\D/g,
        ""
      );

    onFiltersChange({
      projectId: numericValue,
    });
  }

  return (
    <section className="child-search">
      <div className="child-search__header">
        <h2 className="child-search__title">
          Find a Child
        </h2>
      </div>

      <div className="child-search__rows">
        {/* General search controls */}
        <div className="child-search__row child-search__row--general">
          <div className="child-search__field">
            <label htmlFor="scope">
              Scope
            </label>

            <select
              id="scope"
              value={scope}
              onChange={(event) =>
                onFiltersChange({
                  scope:
                    event.target.value,
                })
              }
            >
              <option value="Available">
                Available
              </option>

              <option value="All">
                All
              </option>
            </select>
          </div>

          <div className="child-search__field">
            <label htmlFor="gender">
              Gender
            </label>

            <select
              id="gender"
              value={gender}
              onChange={(event) =>
                onFiltersChange({
                  gender:
                    event.target.value,
                })
              }
            >
              <option value="">
                Any
              </option>

              <option value="F">
                Female
              </option>

              <option value="M">
                Male
              </option>
            </select>
          </div>

          <div className="child-search__field">
            <label htmlFor="project-id">
              Project ID
            </label>

            <input
              id="project-id"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={projectId}
              onChange={
                handleProjectIdChange
              }
              placeholder="e.g. 203415"
            />
          </div>

          <div className="child-search__field">
            <label htmlFor="sort-by">
              Sort by
            </label>

            <select
              id="sort-by"
              value={sortBy}
              onChange={(event) =>
                onFiltersChange({
                  sortBy:
                    event.target.value,
                })
              }
            >
              <option value="SdChildId">
                Child ID
              </option>

              <option value="Age">
                Age
              </option>

              <option value="Country">
                Country
              </option>
            </select>
          </div>

          <div className="child-search__field">
            <label htmlFor="language">
              Language
            </label>

            <select
              id="language"
              value={language}
              onChange={(event) =>
                onFiltersChange({
                  language:
                    event.target.value,
                })
              }
            >
              <option value="en">
                English
              </option>

              <option value="fr">
                French
              </option>
            </select>
          </div>

          <div className="child-search__field child-search__field--photo">
            <span className="child-search__field-label">
              Photo
            </span>

            <label
              className="child-search__checkbox-label"
              htmlFor="has-photo"
            >
              <input
                id="has-photo"
                type="checkbox"
                checked={
                  hasPhoto === true
                }
                onChange={(event) =>
                  onFiltersChange({
                    hasPhoto:
                      event.target.checked
                        ? true
                        : "",
                  })
                }
              />

              Has photo
            </label>
          </div>
        </div>

        {/* Location */}
        <div className="child-search__row child-search__row--location">
          <div className="child-search__field">
            <label htmlFor="region">
              Region
            </label>

            <select
              id="region"
              value={selectedRegion}
              disabled={
                lookupLoading ||
                regions.length === 0
              }
              onChange={(event) =>
                onRegionChange(
                  event.target.value
                )
              }
            >
              <option value="">
                All regions
              </option>

              {regions.map((region) => (
                <option
                  key={region.code}
                  value={region.code}
                >
                  {region.label}
                </option>
              ))}
            </select>

            {lookupError && (
              <small>
                Unable to load options.
              </small>
            )}
          </div>

          <div className="child-search__field">
            <label htmlFor="countries">
              Countries
            </label>

            <select
              id="countries"
              multiple
              value={countries}
              onChange={
                handleCountryChange
              }
              disabled={
                lookupLoading ||
                countryOptions.length === 0
              }
            >
              {lookupLoading ? (
                <option disabled>
                  Loading countries...
                </option>
              ) : (
                countryOptions.map(
                  (country) => (
                    <option
                      key={country.code}
                      value={country.code}
                    >
                      {country.label}
                    </option>
                  )
                )
              )}
            </select>
          </div>
        </div>

        {/* Age and birthday */}
        <div className="child-search__row child-search__row--age-date">
          <AgeRange
            minAge={minAge}
            maxAge={maxAge}
            onChange={
              onFiltersChange
            }
          />

          <div className="child-search__field">
            <label htmlFor="birth-month">
              Birth month
            </label>

            <select
              id="birth-month"
              value={birthMonth}
              onChange={
                handleBirthMonthChange
              }
            >
              <option value="">
                Any
              </option>

              {MONTHS.map((month) => (
                <option
                  key={month.value}
                  value={month.value}
                >
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <div className="child-search__field">
            <label htmlFor="birth-day">
              Birth day
            </label>

            <select
              id="birth-day"
              value={birthDay}
              disabled={
                birthMonth === ""
              }
              onChange={(event) =>
                onFiltersChange({
                  birthDay:
                    event.target.value,
                })
              }
            >
              <option value="">
                Any
              </option>

              {birthdayDays.map(
                (day) => (
                  <option
                    key={day}
                    value={String(day)}
                  >
                    {day}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Search;