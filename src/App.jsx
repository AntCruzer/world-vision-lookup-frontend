import {
  useEffect,
  useState,
} from "react";

import {
  Routes,
  Route,
} from "react-router-dom";

import "./App.css";

import ChildSearch from "./pages/ChildSearch";
import ChildDetail from "./pages/ChildDetail";
import StatusMessage from "./components/StatusMessage";
import MockScenarioPanel from "./components/MockScenarioPanel";

import {
  searchChildren,
  getCountries,
  getRegions,
} from "./api/childApi";

const PAGE_SIZE = 10;

const MOCKING_ENABLED =
  import.meta.env.DEV &&
  import.meta.env
    .VITE_USE_MOCK_API === "true";

const DEFAULT_SEARCH_PARAMS = {
  scope: "Available",
  countries: [],
  minAge: "",
  maxAge: "",
  gender: "",
  projectId: "",
  birthDay: "",
  birthMonth: "",
  hasPhoto: "",
  sortBy: "SdChildId",
  language: "en",
};

function App() {
  const [
    children,
    setChildren,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState(null);

  const [
    retryCount,
    setRetryCount,
  ] = useState(0);

  const [
    searchParams,
    setSearchParams,
  ] = useState(
    DEFAULT_SEARCH_PARAMS
  );

  // Development-only forced
  // MSW scenario.
  const [
    mockScenario,
    setMockScenario,
  ] = useState("");

  // Pagination
  const [
    pageNumber,
    setPageNumber,
  ] = useState(1);

  const [
    pageInfo,
    setPageInfo,
  ] = useState({
    page: 1,
    pageSize: PAGE_SIZE,
    hasNextPage: false,
    total: undefined,
  });

  // Lookup data
  const [
    regions,
    setRegions,
  ] = useState([]);

  const [
    countryOptions,
    setCountryOptions,
  ] = useState([]);

  const [
    selectedRegion,
    setSelectedRegion,
  ] = useState("");

  const [
    lookupLoading,
    setLookupLoading,
  ] = useState(true);

  const [
    lookupError,
    setLookupError,
  ] = useState(null);

  // Child search
  useEffect(() => {
    const controller =
      new AbortController();

    async function getChildren() {
      setLoading(true);
      setError(null);

      try {
        const data =
          await searchChildren(
            {
              ...searchParams,
              pageNumber,
              pageSize: PAGE_SIZE,
            },
            {
              signal:
                controller.signal,

              mockScenario:
                MOCKING_ENABLED
                  ? mockScenario
                  : "",
            }
          );

        setChildren(data.items);

        setPageInfo({
          page: data.page,
          pageSize: data.pageSize,
          hasNextPage:
            data.hasNextPage,
          total: data.total,
        });
      } catch (error) {
        if (
          error.name ===
          "AbortError"
        ) {
          return;
        }

        setError(error);
      } finally {
        if (
          !controller.signal.aborted
        ) {
          setLoading(false);
        }
      }
    }

    getChildren();

    return () => {
      controller.abort();
    };
  }, [
    searchParams,
    pageNumber,
    retryCount,
    mockScenario,
  ]);

  // Regions
  useEffect(() => {
    async function loadRegions() {
      try {
        const data =
          await getRegions();

        setRegions(data);
      } catch (error) {
        setLookupError(
          error.message
        );
      }
    }

    loadRegions();
  }, []);

  // Countries
  useEffect(() => {
    async function loadCountries() {
      setLookupLoading(true);
      setLookupError(null);

      try {
        const data =
          await getCountries(
            selectedRegion
          );

        setCountryOptions(data);
      } catch (error) {
        setLookupError(
          error.message
        );

        setCountryOptions([]);
      } finally {
        setLookupLoading(false);
      }
    }

    loadCountries();
  }, [selectedRegion]);

  function handleFiltersChange(
    updates
  ) {
    setSearchParams(
      (currentParams) => ({
        ...currentParams,
        ...updates,
      })
    );

    setPageNumber(1);
  }

  function handleRegionChange(
    regionCode
  ) {
    setSelectedRegion(
      regionCode
    );

    setSearchParams(
      (currentParams) => ({
        ...currentParams,
        countries: [],
      })
    );

    setPageNumber(1);
  }

  function handleResetFilters() {
    setSearchParams(
      (currentParams) => ({
        ...DEFAULT_SEARCH_PARAMS,

        /*
         * Sort and language are search/display
         * preferences rather than filters, so
         * clearing filters preserves them.
         */
        sortBy:
          currentParams.sortBy,
        language:
          currentParams.language,
      })
    );

    setSelectedRegion("");
    setPageNumber(1);
  }

  function handlePreviousPage() {
    setPageNumber(
      (currentPage) =>
        Math.max(
          1,
          currentPage - 1
        )
    );
  }

  function handleNextPage() {
    if (!pageInfo.hasNextPage) {
      return;
    }

    setPageNumber(
      (currentPage) =>
        currentPage + 1
    );
  }

  function handleRetry() {
    setRetryCount(
      (count) => count + 1
    );
  }

  function handleMockScenarioChange(
    scenario
  ) {
    setMockScenario(scenario);
    setPageNumber(1);
  }

  return (
    <>
      {MOCKING_ENABLED && (
        <MockScenarioPanel
          value={mockScenario}
          onChange={
            handleMockScenarioChange
          }
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            <ChildSearch
              childResults={
                children
              }
              loading={loading}
              error={error}
              onRetry={
                handleRetry
              }
              searchParams={
                searchParams
              }
              onFiltersChange={
                handleFiltersChange
              }
              onResetFilters={
                handleResetFilters
              }
              regions={regions}
              countryOptions={
                countryOptions
              }
              selectedRegion={
                selectedRegion
              }
              onRegionChange={
                handleRegionChange
              }
              lookupLoading={
                lookupLoading
              }
              lookupError={
                lookupError
              }
              pageInfo={pageInfo}
              onPreviousPage={
                handlePreviousPage
              }
              onNextPage={
                handleNextPage
              }
            />
          }
        />

        <Route
          path="/children/:childId"
          element={
            loading ? (
              <StatusMessage
                title="Loading children..."
                message="Please wait while we retrieve the child records."
              />
            ) : error ? (
              <StatusMessage
                title="Unable to load children"
                message="Something went wrong while retrieving the child records."
                actionText="Try again"
                onAction={
                  handleRetry
                }
              />
            ) : (
              <ChildDetail
                childResults={
                  children
                }
              />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;