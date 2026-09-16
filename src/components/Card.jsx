// import { Link } from "react-router-dom";

// import "./Card.css";

// function Card({ child }) {
//   const {
//     sdChildId,
//     firstName,
//     gender,
//     ageInYears,
//     country,
//     status,
//     isAvailable,
//   } = child;

//   const displayGender = {
//     M: "Male",
//     F: "Female",
//   }[gender] ?? gender;

//   const cardContent = (
//     <div className="child-card__details">
//       <div className="child-card__heading">
//         <h3 className="child-card__name">
//           {firstName ?? "Name unavailable"}
//         </h3>

//         <span
//           className={
//             isAvailable
//               ? "child-card__status child-card__status--available"
//               : "child-card__status child-card__status--unavailable"
//           }
//         >
//           {status}
//         </span>
//       </div>

//       <p className="child-card__id">
//         {sdChildId}
//       </p>

//       <div className="child-card__information">
//         <p>
//           <span className="child-card__label">
//             Gender
//           </span>

//           <span>
//             {displayGender ?? "—"}
//           </span>
//         </p>

//         <p>
//           <span className="child-card__label">
//             Age
//           </span>

//           <span>
//             {ageInYears !== null &&
//             ageInYears !== undefined
//               ? ageInYears
//               : "—"}
//           </span>
//         </p>

//         <p>
//           <span className="child-card__label">
//             Country
//           </span>

//           <span>
//             {country ?? "—"}
//           </span>
//         </p>
//       </div>

//       {!isAvailable && (
//         <p className="child-card__availability-message">
//           This child is not currently
//           available.
//         </p>
//       )}
//     </div>
//   );

//   if (!isAvailable) {
//     return (
//       <article className="child-card child-card--unavailable">
//         {cardContent}
//       </article>
//     );
//   }

//   return (
//     <Link
//       className="child-card"
//       to={`/children/${sdChildId}`}
//       aria-label={`View ${
//         firstName ?? "child"
//       }`}
//     >
//       {cardContent}
//     </Link>
//   );
// }

// export default Card;

import { Link } from "react-router-dom";

import "./Card.css";

function Card({ child }) {
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
          ? "child-card"
          : "child-card child-card--unavailable"
      }
      to={`/children/${sdChildId}`}
      aria-label={`View ${
        firstName ?? "child"
      }`}
    >
      <div className="child-card__details">
        <div className="child-card__heading">
          <h3 className="child-card__name">
            {firstName ?? "Name unavailable"}
          </h3>

          <span
            className={
              isAvailable
                ? "child-card__status child-card__status--available"
                : "child-card__status child-card__status--unavailable"
            }
          >
            {status}
          </span>
        </div>

        <p className="child-card__id">
          {sdChildId}
        </p>

        <div className="child-card__information">
          <p>
            <span className="child-card__label">
              Gender
            </span>

            <span>
              {displayGender ?? "—"}
            </span>
          </p>

          <p>
            <span className="child-card__label">
              Age
            </span>

            <span>
              {ageInYears !== null &&
              ageInYears !== undefined
                ? ageInYears
                : "—"}
            </span>
          </p>

          <p>
            <span className="child-card__label">
              Country
            </span>

            <span>
              {country ?? "—"}
            </span>
          </p>
        </div>

        {!isAvailable && (
          <p className="child-card__availability-message">
            This child is not currently
            available.
          </p>
        )}
      </div>
    </Link>
  );
}

export default Card;
