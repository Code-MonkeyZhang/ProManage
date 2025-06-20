import React from "react";
import Avatar from "../../components/Avatar";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import { useNavigate } from "react-router-dom";
import { ProjectSummaryProps } from "../../types";
import { COLLECTIONS } from "../../constants/firebase";

export default function ProjectSummary({ project }: ProjectSummaryProps) {
  const { deleteDocument } = useFirestore(COLLECTIONS.PROJECTS);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    deleteDocument(project.id);
    navigate("/");
  };

  return (
    <div>
      <div className="project-summary">
        <h2 className="page-title">{project.name}</h2>
        <p>By {project.createdBy.displayName}</p>
        <p className="due-date">
          Project due by {project.dueDate.toDate().toDateString()}
        </p>

        <p className="details">{project.details}</p>

        <h4>Project is assigned to:</h4>

        <div className="assigned-users">
          {project.assignedUsersList.map((user) => (
            <div key={user.id}>
              <Avatar src={user.photoURL}></Avatar>
            </div>
          ))}
        </div>
      </div>
      {user?.uid === project.createdBy.id && (
        <button className="btn" onClick={handleClick}>
          Mark as Complete
        </button>
      )}
    </div>
  );
}
