import React from "react";
import { useParams } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument";
import ProjectSummary from "./ProjectSummary";
import ProjectComments from "./ProjectComments";
import { COLLECTIONS } from "../../constants/firebase";

//styles
import "./Project.css";

export default function Project() {
  const { id } = useParams<{ id: string }>();
  const { error, document } = useDocument(COLLECTIONS.PROJECTS, id || "");

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!document) {
    return <div className="loading">Loading....</div>;
  }

  return (
    <div className="project-details">
      <ProjectSummary project={document} />
      <ProjectComments project={document}></ProjectComments>
    </div>
  );
}
