import React, { useState, FormEvent } from "react";
import { timestamp } from "../../firebase/config";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import Avatar from "../../components/Avatar";
import { ProjectCommentsProps } from "../../types";
import { COLLECTIONS, PROJECT_FIELDS } from "../../constants/firebase";

export default function ProjectComments({ project }: ProjectCommentsProps) {
  const { updateDocument, response } = useFirestore(COLLECTIONS.PROJECTS);
  const [newComment, setNewComment] = useState<string>("");
  const { user } = useAuthContext();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const commentToAdd = {
      displayName: user?.displayName || "",
      photoURL: user?.photoURL || "",
      content: newComment,
      createdAt: timestamp.fromDate(new Date()),
      id: Math.random().toString(), // 临时手段
    };

    console.log(commentToAdd);
    await updateDocument(project.id, {
      [PROJECT_FIELDS.COMMENTS]: [...project.comments, commentToAdd],
    });
    if (!response.error) {
      setNewComment("");
    }
  };

  return (
    <div className="project-comments">
      <h4>Project Comments</h4>

      <ul>
        {project.comments.length > 0 &&
          project.comments.map((comment) => (
            <li key={comment.id}>
              <div className="comment-author">
                <Avatar src={comment.photoURL} />
                <p>{comment.displayName}</p>
              </div>
              <div className="comment-date">
                <p>{comment.createdAt.toDate().toDateString()}</p>
              </div>
              <div className="comment-content">
                <p>{comment.content}</p>
              </div>
            </li>
          ))}
      </ul>

      <form className="add-comment" onSubmit={handleSubmit}>
        <label>
          <span>Add new comment:</span>
          <textarea
            required
            onChange={(e) => setNewComment(e.target.value)}
            value={newComment}
          ></textarea>
        </label>
        <button className="btn">Add Comment</button>
      </form>
    </div>
  );
}
