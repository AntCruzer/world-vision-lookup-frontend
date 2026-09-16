import { Link } from "react-router-dom";

import "./ChildRow.css";

function ChildRow({ child }) {
  const {
    sdChildId,
    firstName,
    gender,
    ageInYears,
    country,
    status,
    isAvailable,
  } = child;

  const displayGender = {
    M: "Male",
    F: "Female",
  }[gender] ?? gender;

  return (
    <Link
      className={
        isAvailable
          ? "child-row"
          : "child-row child-row--unavailable"
      }
      to={`/children/${sdChildId}`}
      aria-label={`View ${
        firstName ?? "child"
      }`}
    >
      <div
        className="child-row__cell child-row__name"
        data-label="Name"
      >
        {firstName ?? "—"}
      </div>

      <div
        className="child-row__cell child-row__id"
        data-label="Child ID"
      >
        {sdChildId}
      </div>

      <div
        className="child-row__cell"
        data-label="Gender"
      >
        {displayGender ?? "—"}
      </div>

      <div
        className="child-row__cell"
        data-label="Age"
      >
        {ageInYears !== null &&
        ageInYears !== undefined
          ? ageInYears
          : "—"}
      </div>

      <div
        className="child-row__cell"
        data-label="Country"
      >
        {country ?? "—"}
      </div>

      <div
        className="child-row__cell"
        data-label="Status"
      >
        <span
          className={
            isAvailable
              ? "child-row__status child-row__status--available"
              : "child-row__status child-row__status--unavailable"
          }
        >
          {status}
        </span>
      </div>
    </Link>
  );
}

export default ChildRow;
