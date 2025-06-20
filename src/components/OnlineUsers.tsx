import React from "react";
import { useCollection } from "../hooks/useCollection";
import Avatar from "./Avatar";

//Style
import "./OnlineUsers.css";

interface OnlineUser {
  id: string;
  displayName: string;
  photoURL: string;
  online: boolean;
}

export default function OnlineUsers() {
  const { error, documents } = useCollection("USERS");

  return (
    <div className="user-list">
      <h2>All Users</h2>
      {error && <div className="error">{error}</div>}
      {documents &&
        documents.map((user: OnlineUser) => (
          <div key={user.id} className="user-list-item">
            {user.online && <span className="online-user"></span>}
            <span>{user.displayName}</span>
            <Avatar src={user.photoURL}></Avatar>
          </div>
        ))}
    </div>
  );
}
