import React from "react";
import { AvatarProps } from "../types";

// styles
import "./Avatar.css";

export default function Avatar({ src }: AvatarProps) {
  return (
    <div className="avatar">
      <img src={src} alt="user avatar" />
    </div>
  );
}
