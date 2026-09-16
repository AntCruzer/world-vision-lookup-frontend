import "./ChildDetailed.css";

import {
  exportChildCsv,
} from "../utils/exportChildCsv";

function hasValue(value) {
  return (
    value !== null &&
    value !== undefined &&
    value !== ""
  );
}

function InfoRow({
  label,
  value,
}) {
  if (!hasValue(value)) {
    return null;
  }

  return (
    <div className="child-detailed__info-row">
      <span className="child-detailed__label">
        {label}
      </span>

      <span className="child-detailed__value">
        {value}
      </span>
    </div>
  );
}

function ChildDetailed({
  child,
}) {
  const displayGender =
    {
      M: "Male",
      F: "Female",
    }[child.gender] ??
    child.gender;

  const birthday =
    hasValue(child.birthDay) &&
    hasValue(child.birthMonth)
      ? `${child.birthMonth}/${child.birthDay}`
      : null;

  function handleExport() {
    exportChildCsv(child);
  }

  return (
    <section className="child-detailed">
      {!child.isAvailable && (
        <div
          className="child-detailed__availability-notice"
          role="status"
        >
          <strong>
            {child.status}
          </strong>

          <span>
            This child is not currently
            available.
          </span>
        </div>
      )}

      <div className="child-detailed__top">
        <div className="child-detailed__left">
          <div className="child-detailed__photo">
            {child.greetingPhoto ? (
              <img
                src={
                  child.greetingPhoto
                }
                alt={`Photo of ${
                  child.firstName ??
                  "child"
                }`}
              />
            ) : (
              <div className="child-detailed__photo-placeholder">
                No photo
              </div>
            )}
          </div>

          <div className="child-detailed__basic-info">
            <InfoRow
              label="Name"
              value={
                child.firstName
              }
            />

            <InfoRow
              label="Gender"
              value={
                displayGender
              }
            />

            <InfoRow
              label="Age"
              value={
                child.ageInYears
              }
            />

            <InfoRow
              label="Country"
              value={
                child.country
              }
            />
          </div>
        </div>

        <div className="child-detailed__right">
          <div className="child-detailed__right-header">
            <h2>
              Child Information
            </h2>

            <button
              type="button"
              className="child-detailed__export-button"
              onClick={
                handleExport
              }
            >
              Export CSV
            </button>
          </div>

          <div className="child-detailed__section">
            <h3>
              Record
            </h3>

            <InfoRow
              label="Child ID"
              value={
                child.sdChildId
              }
            />

            <InfoRow
              label="Project ID"
              value={
                child.projectId
              }
            />

            <InfoRow
              label="Country Code"
              value={
                child.countryCode
              }
            />

            <InfoRow
              label="Birthday"
              value={birthday}
            />

            <InfoRow
              label="Status"
              value={
                child.status
              }
            />
          </div>

          <div className="child-detailed__section">
            <h3>
              Interests
            </h3>

            <InfoRow
              label="Favourite Activity"
              value={
                child.favouriteActivity
              }
            />

            <InfoRow
              label="Favourite Subject"
              value={
                child.favouriteSubject
              }
            />

            <InfoRow
              label="Chore"
              value={
                child.chore
              }
            />
          </div>

          <div className="child-detailed__section">
            <h3>
              School
            </h3>

            <InfoRow
              label="School Level"
              value={
                child.schoolLevel
              }
            />

            <InfoRow
              label="Grade"
              value={
                child.grade
              }
            />
          </div>

          <div className="child-detailed__section">
            <h3>
              Family
            </h3>

            <InfoRow
              label="Lives With"
              value={
                child.livesWith
              }
            />

            <InfoRow
              label="Brothers"
              value={
                child.numberOfBrothers
              }
            />

            <InfoRow
              label="Sisters"
              value={
                child.numberOfSisters
              }
            />
          </div>

          {child.greetingVideo && (
            <div className="child-detailed__section">
              <h3>
                Greeting Video
              </h3>

              <video
                className="child-detailed__video"
                controls
                src={
                  child.greetingVideo
                }
              >
                Your browser does not
                support video.
              </video>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ChildDetailed;