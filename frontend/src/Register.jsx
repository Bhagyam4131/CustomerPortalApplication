import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    if (password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    let users = [];

    try {
      users = JSON.parse(localStorage.getItem("users") || "[]");
    } catch {
      users = [];
    }

    if (!Array.isArray(users)) {
      users = [];
    }

    const cleanEmail = email.trim().toLowerCase();

    const exists = users.some(
      (user) => user.email?.trim().toLowerCase() === cleanEmail
    );

    if (exists) {
      alert("Email already registered. Please log in.");
      return;
    }

    users.push({
      name: name.trim(),
      email: cleanEmail,
      password
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful! Please sign in.");
    navigate("/");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="brand">✦ CustomerHub</h2>

        <p className="auth-label">GET STARTED</p>
        <h1>Create your account</h1>
        <p className="description">
          Register to manage your customer information.
        </p>

        <form onSubmit={handleRegister}>
          <label htmlFor="register-name">Full Name</label>
          <input
            id="register-name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />

          <label htmlFor="register-email">Email Address</label>
          <input
            id="register-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            autoComplete="new-password"
            required
          />

          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={6}
            autoComplete="new-password"
            required
          />

          <button className="auth-submit" type="submit">
            Create Account →
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </div>
    </div>
  );
}