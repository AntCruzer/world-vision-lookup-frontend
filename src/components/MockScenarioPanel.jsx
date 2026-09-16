import "./MockScenarioPanel.css";

const SEARCH_SCENARIOS = [
  {
    value: "",
    label: "Automatic",
  },
  {
    value: "defaultFirstPage",
    label: "Default first page",
  },
  {
    value: "filteredWithTotal",
    label: "Filtered with total",
  },
  {
    value: "scopeAllMixedStatuses",
    label: "All scopes / mixed statuses",
  },
  {
    value: "french",
    label: "French",
  },
  {
    value: "lastPage",
    label: "Last page",
  },
  {
    value: "empty",
    label: "Empty results",
  },
  {
    value: "errorAgeRange",
    label: "Error: invalid age range",
  },
  {
    value: "errorBadScope",
    label: "Error: invalid scope",
  },
  {
    value: "errorMultiple",
    label: "Error: multiple validation failures",
  },
];

function MockScenarioPanel({
  value,
  onChange,
}) {
  return (
    <aside className="mock-scenario-panel">
      <div className="mock-scenario-panel__content">
        <label htmlFor="mock-scenario">
          MSW test scenario
        </label>

        <select
          id="mock-scenario"
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
        >
          {SEARCH_SCENARIOS.map(
            (scenario) => (
              <option
                key={
                  scenario.value ||
                  "automatic"
                }
                value={scenario.value}
              >
                {scenario.label}
              </option>
            )
          )}
        </select>

        <small>
          Development only. Automatic uses
          the normal request parameters.
        </small>
      </div>
    </aside>
  );
}

export default MockScenarioPanel;