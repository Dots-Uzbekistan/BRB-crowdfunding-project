import React, { useState } from "react";
import styles from "./AsideDashboard.module.scss";

const AsideDashboard = ({ onApplyFilters }) => {
  const [sortBy, setSortBy] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [fundingState, setFundingState] = useState("");
  const [projectState, setProjectState] = useState("");
  const [raisedPercentage, setRaisedPercentage] = useState("");

  const renderRadioGroup = (name, options, selectedValue, setSelectedValue) => (
    <div className={styles.radioGroup}>
      {options.map((option) => (
        <label key={option.value} className={styles.radioOption}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={() =>
              setSelectedValue(
                selectedValue === option.value ? "" : option.value
              )
            }
          />
          {option.label}
        </label>
      ))}
    </div>
  );

  const handleApplyFilters = () => {
    console.log("Applying filters from AsideDashboard:", {
      sort: sortBy,
      goal_amount: goalAmount,
      funding_status: fundingState,
      project_state: projectState,
      raised_percentage: raisedPercentage,
    });
    onApplyFilters({
      sort: sortBy,
      goal_amount: goalAmount,
      funding_status: fundingState,
      project_state: projectState,
      raised_percentage: raisedPercentage,
    });
  };

  const handleDeselectAll = () => {
    setSortBy("");
    setGoalAmount("");
    setFundingState("");
    setProjectState("");
    setRaisedPercentage("");

    onApplyFilters({
      sort: "",
      goal_amount: "",
      funding_status: "",
      project_state: "",
      raised_percentage: "",
    });
  };

  return (
    <aside className={styles.aside_filter}>
      <div className={styles.filtersContainer}>
        <h3 className={styles.filterHeader}>Filters</h3>

        <div className={styles.filterSection}>
          <h4>Sort by:</h4>
          {renderRadioGroup(
            "sortBy",
            [
              { value: "newest", label: "Newest" },
              { value: "endDate", label: "End date" },
              { value: "mostFunded", label: "Most Funded" },
              { value: "mostBacked", label: "Most Backed" },
              { value: "mostPopular", label: "Most Popular" },
            ],
            sortBy,
            setSortBy
          )}
        </div>

        <div className={styles.filterSection}>
          <h4>Goal amount:</h4>
          {renderRadioGroup(
            "goalAmount",
            [
              { value: "lt_1000", label: "< 10 mln UZS" },
              { value: "btw_1000_10000", label: "10 mln - 100 mln UZS" },
              { value: "btw_10000_50000", label: "100 mln - 500 mln UZS" },
              { value: "gt_50000", label: "> 500 mln UZS" },
            ],
            goalAmount,
            setGoalAmount
          )}
        </div>

        <div className={styles.filterSection}>
          <h4>Funding state:</h4>
          {renderRadioGroup(
            "fundingState",
            [
              { value: "successful", label: "Successful" },
              { value: "live", label: "Live" },
              { value: "upcoming", label: "Upcoming" },
            ],
            fundingState,
            setFundingState
          )}
        </div>

        <div className={styles.filterSection}>
          <h4>Project state:</h4>
          {renderRadioGroup(
            "projectState",
            [
              { value: "concept", label: "Concept" },
              { value: "prototype", label: "Prototype" },
              { value: "production", label: "Production" },
              { value: "launched", label: "Launched" },
            ],
            projectState,
            setProjectState
          )}
        </div>

        <div className={styles.filterSection}>
          <h4>Raised percentage:</h4>
          {renderRadioGroup(
            "raisedPercentage",
            [
              { value: "lt_75", label: "< 75%" },
              { value: "btw_75_100", label: "75% - 100%" },
              { value: "gt_100", label: "> 100%" },
            ],
            raisedPercentage,
            setRaisedPercentage
          )}
        </div>

        <div className={styles.buttonsContainer}>
          <button className={styles.applyButton} onClick={handleApplyFilters}>
            Apply Filters
          </button>
          <button className={styles.deselectButton} onClick={handleDeselectAll}>
            Reset
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AsideDashboard;
