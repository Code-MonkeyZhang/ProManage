import React from "react";
import { ProjectFilterProps } from "../../types";
import { PROJECT_FILTERS } from "../../constants/firebase";

const filterList: string[] = [
  PROJECT_FILTERS.ALL,
  PROJECT_FILTERS.MINE,
  PROJECT_FILTERS.DEVELOPMENT,
  PROJECT_FILTERS.DESIGN,
  PROJECT_FILTERS.MARKETING,
  PROJECT_FILTERS.SALES,
];

export default function ProjectFilter({
  currentFilter,
  changeFilter,
}: ProjectFilterProps) {
  const handleClick = (newFilter: string) => {
    changeFilter(newFilter);
  };

  return (
    <div className="project-filter">
      <nav>
        <p>Filter by:</p>
        {filterList.map((f) => (
          // Create buttons
          <button
            key={f}
            onClick={() => handleClick(f)}
            className={currentFilter === f ? "active" : ""} // change style if chosen
          >
            {f}
          </button>
        ))}
      </nav>
    </div>
  );
}
