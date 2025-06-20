import React from "react";
import { ProjectFilterProps } from "../../types";

const filterList: string[] = [
  "all",
  "mine",
  "development",
  "design",
  "marketing",
  "sales",
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
