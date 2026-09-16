import { useState } from "react";

import Search from "../components/Search";
import ActiveFilters from "../components/ActiveFilters";
import Card from "../components/Card";
import ChildRow from "../components/ChildRow";
import StatusMessage from "../components/StatusMessage";
import Pagination from "../components/Pagination";

import "./ChildSearch.css";

function ChildSearch({
  childResults,
  loading,
  error,
  onRetry,
  searchParams,
  onFiltersChange,
  onResetFilters,
  regions,
  countryOptions,
  selectedRegion,
  onRegionChange,
  lookupLoading,
  lookupError,
  pageInfo,
  onPreviousPage,
  onNextPage,
}) {
  const [viewMode, setViewMode] =
    useState("cards");

  return (
    <main className="child-search-page">
      <Search
        searchParams={searchParams}
        onFiltersChange={
          onFiltersChange
        }
        regions={regions}
        countryOptions={
          countryOptions
        }
        selectedRegion={
          selectedRegion
        }
        onRegionChange={
          onRegionChange
        }
        lookupLoading={
          lookupLoading
        }
        lookupError={
          lookupError
        }
      />

      <ActiveFilters
        searchParams={searchParams}
        regions={regions}
        countryOptions={
          countryOptions
        }
        selectedRegion={
          selectedRegion
        }
        onFiltersChange={
          onFiltersChange
        }
        onRegionChange={
          onRegionChange
        }
        onResetFilters={
          onResetFilters
        }
      />

      <section className="search-results">
        <div className="search-results__header">
          <h2 className="search-results__title">
            Search Results
          </h2>

          <div
            className="view-toggle"
            role="group"
            aria-label="Results view"
          >
            <button
              type="button"
              className={
                viewMode === "cards"
                  ? "view-toggle__button view-toggle__button--active"
                  : "view-toggle__button"
              }
              aria-pressed={
                viewMode === "cards"
              }
              onClick={() =>
                setViewMode("cards")
              }
            >
              Cards
            </button>

            <button
              type="button"
              className={
                viewMode === "rows"
                  ? "view-toggle__button view-toggle__button--active"
                  : "view-toggle__button"
              }
              aria-pressed={
                viewMode === "rows"
              }
              onClick={() =>
                setViewMode("rows")
              }
            >
              Rows
            </button>
          </div>
        </div>

        {loading ? (
          <StatusMessage
            title="Loading children..."
            message="Updating the search results."
          />
        ) : error ? (
          <StatusMessage
            title="Unable to load children"
            message="Something went wrong while retrieving the child records."
            actionText="Try again"
            onAction={onRetry}
          />
        ) : childResults.length > 0 ? (
          <>
            {viewMode === "cards" ? (
              <div className="search-results__grid">
                {childResults.map(
                  (child) => (
                    <Card
                      key={
                        child.sdChildId
                      }
                      child={child}
                    />
                  )
                )}
              </div>
            ) : (
              <div className="search-results__rows-wrapper">
                <div className="search-results__rows">
                  <div
                    className="search-results__row-header"
                    aria-hidden="true"
                  >
                    <span>
                      Name
                    </span>

                    <span>
                      Child ID
                    </span>

                    <span>
                      Gender
                    </span>

                    <span>
                      Age
                    </span>

                    <span>
                      Country
                    </span>

                    <span>
                      Status
                    </span>
                  </div>

                  {childResults.map(
                    (child) => (
                      <ChildRow
                        key={
                          child.sdChildId
                        }
                        child={child}
                      />
                    )
                  )}
                </div>
              </div>
            )}

            <Pagination
              page={pageInfo.page}
              pageSize={
                pageInfo.pageSize
              }
              hasNextPage={
                pageInfo.hasNextPage
              }
              total={pageInfo.total}
              loading={loading}
              onPrevious={
                onPreviousPage
              }
              onNext={
                onNextPage
              }
            />
          </>
        ) : (
          <StatusMessage
            title="No children found"
            message="No children match the current search criteria."
            actionText="Clear filters"
            onAction={
              onResetFilters
            }
          />
        )}
      </section>
    </main>
  );
}

export default ChildSearch;