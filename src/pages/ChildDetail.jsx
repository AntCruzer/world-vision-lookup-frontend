import {
  Link,
  useParams,
} from "react-router-dom";

import ChildDetailed from "../components/ChildDetailed";

import "./ChildDetail.css";

function ChildDetail({
  childResults,
}) {
  const { childId } =
    useParams();

  const child =
    childResults.find(
      (child) =>
        child.sdChildId ===
        childId
    );

  if (!child) {
    return (
      <main className="detailed-page">
        <div className="detailed-page__not-found">
          <h1>
            Child not found
          </h1>

          <Link
            className="back-button"
            to="/"
          >
            ← Back to search
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="detailed-page">
      <div className="detailed-page__navigation">
        <Link
          className="back-button"
          to="/"
        >
          ← Back to search
        </Link>
      </div>

      <ChildDetailed
        child={child}
      />
    </main>
  );
}

export default ChildDetail;