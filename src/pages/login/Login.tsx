import React, { useState, FormEvent } from "react";
import { useLogin } from "../../hooks/useLogin";

// styles
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login, isPending, error } = useLogin();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email, password);
    login(email, password);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>
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

        {!isPending && <button className="btn">Login</button>}
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
