import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../components/Avatar";
import { ProjectListProps } from "../types";

// styles
import "./ProjectList.css";

export default function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="project-list">
      {projects.length === 0 && <p>No Project Yet!</p>}
      {projects.map((project) => (
        <Link to={`/project/${project.id}`} key={project.id}>
          <h4>{project.name}</h4>
          <p>Due by {project.dueDate.toDate().toDateString()}</p>
          <div className="assigned-to">
            <ul>
              {project.assignedUsersList.map((user) => (
                <li key={user.photoURL}>
                  <Avatar src={user.photoURL} />
                </li>
              ))}
            </ul>
          </div>
        </Link>
      ))}
    </div>
  );
}
