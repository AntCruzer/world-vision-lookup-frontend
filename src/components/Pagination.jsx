import "./Pagination.css";

function Pagination({
  page,
  pageSize,
  hasNextPage,
  total,
  loading,
  onPrevious,
  onNext,
}) {
  return (
    <nav
      className="pagination"
      aria-label="Search results pagination"
    >
      <div className="pagination__info">
        <span>Page {page}</span>

        <span>
          {pageSize} results per page
        </span>

        {typeof total === "number" && (
          <span>
            {total} children found
          </span>
        )}
      </div>

      <div className="pagination__buttons">
        <button
          type="button"
          onClick={onPrevious}
          disabled={page <= 1 || loading}
        >
          Previous
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={
            !hasNextPage || loading
          }
        >
          Next
        </button>
      </div>
    </nav>
  );
}

export default Pagination;