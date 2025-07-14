"use client";

import { useState } from "react";
import { User } from "@/core/models/user";

export default function AuthFormApi() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMessage = data.error || "Erreur inconnue";
        throw new Error(errorMessage);
      }

      setUser(data as User);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Erreur inconnue";
      setError(errorMessage);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (loading) {
      return "Connexion...";
    }
    return "Se connecter";
  };

  const renderUserSection = () => {
    if (!user) {
      return null;
    }

    return (
      <div>
        <p>
          Connecté en tant que : <b>{user.email}</b>
        </p>
      </div>
    );
  };

  const renderLoginForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", marginBottom: 8, width: "100%" }}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: "block", marginBottom: 8, width: "100%" }}
        />
        <button type="submit" disabled={loading} style={{ width: "100%" }}>
          {getButtonText()}
        </button>
      </form>
    );
  };

  const renderMainContent = () => {
    if (user) {
      return renderUserSection();
    }
    return renderLoginForm();
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
      <h2>Connexion (API route)</h2>
      {renderMainContent()}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
