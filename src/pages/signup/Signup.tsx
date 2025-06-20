import React, { useState, FormEvent, ChangeEvent } from "react";
import { useSignup } from "../../hooks/useSignup";

// styles
import "./Signup.css";

export default function Signup() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const { signup, isPending, error } = useSignup();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email, password, displayName, thumbnail);
    if (thumbnail) {
      signup(email, password, displayName, thumbnail);
    }
  };

  /*
  Select image file
  */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    // set thumbnail back to null
    setThumbnail(null);
    let selected = e.target.files?.[0]; // 选择用户上传的第一个文件
    console.log(selected);

    if (!selected) {
      setThumbnailError("Please select a file");
      return;
    }

    // if it's not image
    if (!selected.type.includes("image")) {
      setThumbnailError("Selected file must be an image");
      return;
    }

    if (selected.size > 100000) {
      setThumbnailError("Image file size must be less than 100kb");
      return;
    }

    setThumbnailError(null);
    setThumbnail(selected);
    console.log("thumbnail updated");
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Sign up</h2>
        <label>
          <span>email:</span>
          <input
            required
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </label>
        <label>
          <span>password:</span>
          <input
            required
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </label>
        <label>
          <span>display name:</span>
          <input
            required
            type="text"
            onChange={(e) => setDisplayName(e.target.value)}
            value={displayName}
          />
        </label>
        <label>
          <span>Profile thumbnail:</span>
          <input required type="file" onChange={handleFileChange} />
          {thumbnailError && <div className="error">{thumbnailError}</div>}
        </label>

        {!isPending && <button className="btn">Sign up</button>}

        {isPending && (
          <button className="btn" disabled>
            loading
          </button>
        )}

        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}
