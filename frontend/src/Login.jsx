import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    let users = [];

    try {
      users = JSON.parse(localStorage.getItem("users") || "[]");
    } catch {
      users = [];
    }

    const enteredEmail = email.trim().toLowerCase();

    const matchedUser = users.find(
      (user) =>
        user.email?.trim().toLowerCase() === enteredEmail &&
        user.password === password
    );

    if (!matchedUser) {
      alert("Invalid email or password. Please register first.");
      return;
    }

    localStorage.setItem(
      "loggedInUser",
      JSON.stringify({
        name: matchedUser.name,
        email: matchedUser.email
      })
    );

    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="brand">✦ CustomerHub</h2>

        <p className="auth-label">WELCOME BACK</p>
        <h1>Sign in to your account</h1>
        <p className="description">
          Enter your details to continue to your dashboard.
        </p>

        <form onSubmit={handleLogin}>
          <label htmlFor="login-email">Email Address</label>
          <input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <button className="auth-submit" type="submit">
            Sign In →
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
}