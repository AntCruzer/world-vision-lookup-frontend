// import "./ActiveFilters.css";

// const MONTH_LABELS = {
//   "1": "January",
//   "2": "February",
//   "3": "March",
//   "4": "April",
//   "5": "May",
//   "6": "June",
//   "7": "July",
//   "8": "August",
//   "9": "September",
//   "10": "October",
//   "11": "November",
//   "12": "December",
// };

// const GENDER_LABELS = {
//   F: "Female",
//   M: "Male",
// };

// function FilterChip({
//   label,
//   onRemove,
// }) {
//   return (
//     <span className="active-filter-chip">
//       <span className="active-filter-chip__label">
//         {label}
//       </span>

//       <button
//         type="button"
//         className="active-filter-chip__remove"
//         onClick={onRemove}
//         aria-label={`Remove ${label} filter`}
//         title={`Remove ${label}`}
//       >
//         <span aria-hidden="true">
//           ×
//         </span>
//       </button>
//     </span>
//   );
// }

// function ActiveFilters({
//   searchParams,
//   regions,
//   countryOptions,
//   selectedRegion,
//   onFiltersChange,
//   onRegionChange,
// }) {
//   const {
//     scope,
//     countries,
//     minAge,
//     maxAge,
//     gender,
//     projectId,
//     birthMonth,
//     birthDay,
//     hasPhoto,
//   } = searchParams;

//   const selectedCountries =
//     Array.isArray(countries)
//       ? countries
//       : [];

//   const hasMinAge =
//     minAge !== "" &&
//     minAge !== null &&
//     minAge !== undefined;

//   const hasMaxAge =
//     maxAge !== "" &&
//     maxAge !== null &&
//     maxAge !== undefined;

//   const hasAgeFilter =
//     hasMinAge || hasMaxAge;

//   const hasBirthdayFilter =
//     birthMonth !== "" ||
//     birthDay !== "";

//   const hasScopeFilter =
//     scope !== "Available";

//   const hasGenderFilter =
//     gender !== "";

//   const hasProjectFilter =
//     projectId !== "";

//   const hasPhotoFilter =
//     hasPhoto === true;

//   const hasRegionSelection =
//     selectedRegion !== "";

//   const hasActiveFilters =
//     hasScopeFilter ||
//     hasRegionSelection ||
//     selectedCountries.length > 0 ||
//     hasGenderFilter ||
//     hasProjectFilter ||
//     hasAgeFilter ||
//     hasBirthdayFilter ||
//     hasPhotoFilter;

//   if (!hasActiveFilters) {
//     return null;
//   }

//   const selectedRegionLabel =
//     regions.find(
//       (region) =>
//         region.code ===
//         selectedRegion
//     )?.label ?? selectedRegion;

//   function getCountryLabel(code) {
//     return (
//       countryOptions.find(
//         (country) =>
//           country.code === code
//       )?.label ?? code
//     );
//   }

//   function getAgeLabel() {
//     if (hasMinAge && hasMaxAge) {
//       if (
//         Number(minAge) ===
//         Number(maxAge)
//       ) {
//         return `Age: ${minAge} years`;
//       }

//       return `Age: ${minAge}–${maxAge} years`;
//     }

//     if (hasMinAge) {
//       return `Age: ${minAge}+ years`;
//     }

//     return `Age: Up to ${maxAge} years`;
//   }

//   function getBirthdayLabel() {
//     const monthLabel =
//       MONTH_LABELS[
//         String(birthMonth)
//       ];

//     if (
//       monthLabel &&
//       birthDay !== ""
//     ) {
//       return `Birthday: ${monthLabel} ${birthDay}`;
//     }

//     if (monthLabel) {
//       return `Birthday: ${monthLabel}`;
//     }

//     return `Birthday: Day ${birthDay}`;
//   }

//   function removeCountry(
//     countryCode
//   ) {
//     onFiltersChange({
//       countries:
//         selectedCountries.filter(
//           (code) =>
//             code !== countryCode
//         ),
//     });
//   }

//   function clearAllFilters() {
//     /*
//      * Sort and language are intentionally
//      * not changed here because they are
//      * display/search preferences rather
//      * than active filters.
//      */
//     onFiltersChange({
//       scope: "Available",
//       countries: [],
//       minAge: "",
//       maxAge: "",
//       gender: "",
//       projectId: "",
//       birthMonth: "",
//       birthDay: "",
//       hasPhoto: "",
//     });

//     if (selectedRegion !== "") {
//       onRegionChange("");
//     }
//   }

//   return (
//     <section
//       className="active-filters"
//       aria-label="Active filters"
//     >
//       <span className="active-filters__title">
//         Active filters
//       </span>

//       <div className="active-filters__chips">
//         {hasScopeFilter && (
//           <FilterChip
//             label={`Scope: ${scope}`}
//             onRemove={() =>
//               onFiltersChange({
//                 scope: "Available",
//               })
//             }
//           />
//         )}

//         {hasRegionSelection && (
//           <FilterChip
//             label={`Region: ${selectedRegionLabel}`}
//             onRemove={() =>
//               onRegionChange("")
//             }
//           />
//         )}

//         {selectedCountries.map(
//           (countryCode) => (
//             <FilterChip
//               key={countryCode}
//               label={`Country: ${getCountryLabel(
//                 countryCode
//               )}`}
//               onRemove={() =>
//                 removeCountry(
//                   countryCode
//                 )
//               }
//             />
//           )
//         )}

//         {hasGenderFilter && (
//           <FilterChip
//             label={`Gender: ${
//               GENDER_LABELS[
//                 gender
//               ] ?? gender
//             }`}
//             onRemove={() =>
//               onFiltersChange({
//                 gender: "",
//               })
//             }
//           />
//         )}

//         {hasAgeFilter && (
//           <FilterChip
//             label={getAgeLabel()}
//             onRemove={() =>
//               onFiltersChange({
//                 minAge: "",
//                 maxAge: "",
//               })
//             }
//           />
//         )}

//         {hasBirthdayFilter && (
//           <FilterChip
//             label={getBirthdayLabel()}
//             onRemove={() =>
//               onFiltersChange({
//                 birthMonth: "",
//                 birthDay: "",
//               })
//             }
//           />
//         )}

//         {hasProjectFilter && (
//           <FilterChip
//             label={`Project ID: ${projectId}`}
//             onRemove={() =>
//               onFiltersChange({
//                 projectId: "",
//               })
//             }
//           />
//         )}

//         {hasPhotoFilter && (
//           <FilterChip
//             label="Has photo"
//             onRemove={() =>
//               onFiltersChange({
//                 hasPhoto: "",
//               })
//             }
//           />
//         )}
//       </div>

//       <button
//         type="button"
//         className="active-filters__clear-all"
//         onClick={clearAllFilters}
//       >
//         Clear all filters
//       </button>
//     </section>
//   );
// }

// export default ActiveFilters;

import "./ActiveFilters.css";

const MONTH_LABELS = {
  "1": "January",
  "2": "February",
  "3": "March",
  "4": "April",
  "5": "May",
  "6": "June",
  "7": "July",
  "8": "August",
  "9": "September",
  "10": "October",
  "11": "November",
  "12": "December",
};

const GENDER_LABELS = {
  F: "Female",
  M: "Male",
};

function FilterChip({
  label,
  onRemove,
}) {
  return (
    <span className="active-filter-chip">
      <span className="active-filter-chip__label">
        {label}
      </span>

      <button
        type="button"
        className="active-filter-chip__remove"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        title={`Remove ${label}`}
      >
        <span aria-hidden="true">
          ×
        </span>
      </button>
    </span>
  );
}

function ActiveFilters({
  searchParams,
  regions,
  countryOptions,
  selectedRegion,
  onFiltersChange,
  onRegionChange,
  onResetFilters,
}) {
  const {
    scope,
    countries,
    minAge,
    maxAge,
    gender,
    projectId,
    birthMonth,
    birthDay,
    hasPhoto,
  } = searchParams;

  const selectedCountries =
    Array.isArray(countries)
      ? countries
      : [];

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

  const hasBirthdayFilter =
    birthMonth !== "" ||
    birthDay !== "";

  const hasScopeFilter =
    scope !== "Available";

  const hasGenderFilter =
    gender !== "";

  const hasProjectFilter =
    projectId !== "";

  const hasPhotoFilter =
    hasPhoto === true;

  const hasRegionSelection =
    selectedRegion !== "";

  const hasActiveFilters =
    hasScopeFilter ||
    hasRegionSelection ||
    selectedCountries.length > 0 ||
    hasGenderFilter ||
    hasProjectFilter ||
    hasAgeFilter ||
    hasBirthdayFilter ||
    hasPhotoFilter;

  if (!hasActiveFilters) {
    return null;
  }

  const selectedRegionLabel =
    regions.find(
      (region) =>
        region.code ===
        selectedRegion
    )?.label ?? selectedRegion;

  function getCountryLabel(code) {
    return (
      countryOptions.find(
        (country) =>
          country.code === code
      )?.label ?? code
    );
  }

  function getAgeLabel() {
    if (hasMinAge && hasMaxAge) {
      if (
        Number(minAge) ===
        Number(maxAge)
      ) {
        return `Age: ${minAge} years`;
      }

      return `Age: ${minAge}–${maxAge} years`;
    }

    if (hasMinAge) {
      return `Age: ${minAge}+ years`;
    }

    return `Age: Up to ${maxAge} years`;
  }

  function getBirthdayLabel() {
    const monthLabel =
      MONTH_LABELS[
        String(birthMonth)
      ];

    if (
      monthLabel &&
      birthDay !== ""
    ) {
      return `Birthday: ${monthLabel} ${birthDay}`;
    }

    if (monthLabel) {
      return `Birthday: ${monthLabel}`;
    }

    return `Birthday: Day ${birthDay}`;
  }

  function removeCountry(
    countryCode
  ) {
    onFiltersChange({
      countries:
        selectedCountries.filter(
          (code) =>
            code !== countryCode
        ),
    });
  }

  return (
    <section
      className="active-filters"
      aria-label="Active filters"
    >
      <span className="active-filters__title">
        Active filters
      </span>

      <div className="active-filters__chips">
        {hasScopeFilter && (
          <FilterChip
            label={`Scope: ${scope}`}
            onRemove={() =>
              onFiltersChange({
                scope: "Available",
              })
            }
          />
        )}

        {hasRegionSelection && (
          <FilterChip
            label={`Region: ${selectedRegionLabel}`}
            onRemove={() =>
              onRegionChange("")
            }
          />
        )}

        {selectedCountries.map(
          (countryCode) => (
            <FilterChip
              key={countryCode}
              label={`Country: ${getCountryLabel(
                countryCode
              )}`}
              onRemove={() =>
                removeCountry(
                  countryCode
                )
              }
            />
          )
        )}

        {hasGenderFilter && (
          <FilterChip
            label={`Gender: ${
              GENDER_LABELS[
                gender
              ] ?? gender
            }`}
            onRemove={() =>
              onFiltersChange({
                gender: "",
              })
            }
          />
        )}

        {hasAgeFilter && (
          <FilterChip
            label={getAgeLabel()}
            onRemove={() =>
              onFiltersChange({
                minAge: "",
                maxAge: "",
              })
            }
          />
        )}

        {hasBirthdayFilter && (
          <FilterChip
            label={getBirthdayLabel()}
            onRemove={() =>
              onFiltersChange({
                birthMonth: "",
                birthDay: "",
              })
            }
          />
        )}

        {hasProjectFilter && (
          <FilterChip
            label={`Project ID: ${projectId}`}
            onRemove={() =>
              onFiltersChange({
                projectId: "",
              })
            }
          />
        )}

        {hasPhotoFilter && (
          <FilterChip
            label="Has photo"
            onRemove={() =>
              onFiltersChange({
                hasPhoto: "",
              })
            }
          />
        )}
      </div>

      <button
        type="button"
        className="active-filters__clear-all"
        onClick={onResetFilters}
      >
        Clear all filters
      </button>
    </section>
  );
}

export default ActiveFilters;
