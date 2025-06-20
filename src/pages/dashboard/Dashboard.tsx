import React, { useState } from "react";
import { useCollection } from "../../hooks/useCollection";
import ProjectList from "../../components/ProjectList";
import ProjectFilter from "./ProjectFilter";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Project } from "../../types";
import { PROJECT_FILTERS } from "../../constants/firebase";

// styles
import "./Dashboard.css";

export default function Dashboard() {
  const { documents, error } = useCollection("PROJECTS");
  const [filter, setFilter] = useState<string>(PROJECT_FILTERS.ALL);
  const { user } = useAuthContext();

  const changeFilter = (newFilter: string) => {
    setFilter(newFilter);
  };

  const projects = documents
    ? documents.filter((document: Project) => {
        switch (filter) {
          case PROJECT_FILTERS.ALL:
            return true;
          case PROJECT_FILTERS.MINE:
            let assignedToMe = false;
            document.assignedUsersList.forEach((u) => {
              if (u.id === user?.uid) {
                assignedToMe = true;
              }
            });
            return assignedToMe;
          case PROJECT_FILTERS.DEVELOPMENT:
          case PROJECT_FILTERS.DESIGN:
          case PROJECT_FILTERS.SALES:
          case PROJECT_FILTERS.MARKETING:
            console.log(document.category, filter);
            return document.category === filter;
          default:
            return true;
        }
      })
    : [];

  return (
    <div>
      <h2 className="page-title">Dashboard </h2>
      {error && <p className="error">{error}</p>}
      {documents && (
        <ProjectFilter currentFilter={filter} changeFilter={changeFilter} />
      )}
      {documents && <ProjectList projects={projects} />}
    </div>
  );
}
