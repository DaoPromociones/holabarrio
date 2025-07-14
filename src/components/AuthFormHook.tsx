"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function AuthFormHook() {
  const { user, loading, error, login, loginWithGoogle, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
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
        <button onClick={logout} disabled={loading}>
          Se déconnecter
        </button>
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
        <button type="submit" disabled={loading} style={{ width: "100%", marginBottom: 8 }}>
          {getButtonText()}
        </button>
        <button type="button" onClick={loginWithGoogle} disabled={loading} style={{ width: "100%" }}>
          Connexion avec Google
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
      <h2>Connexion (useAuth)</h2>
      {renderMainContent()}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
