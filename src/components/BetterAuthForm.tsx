"use client";

import { useState } from "react";
import { diContainer } from "@/lib/di-container";

type AuthMode = "login" | "register" | "forgot-password";

export default function BetterAuthForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const authService = diContainer.get("AuthService");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await authService.loginWithEmail(formData.email, formData.password);
      setMessage("Connexion réussie !");
      window.location.reload();
    } catch (err) {
      setError("Erreur lors de la connexion");
      console.error(err);
    }

    setLoading(false);
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const passwordsDoNotMatch = formData.password !== formData.confirmPassword;

    if (passwordsDoNotMatch) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
      await authService.registerWithEmail(formData.email, formData.password, formData.name);
      setMessage("Inscription réussie ! Vérifiez votre email pour confirmer votre compte.");
    } catch (err) {
      setError("Erreur lors de l'inscription");
      console.error(err);
    }

    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await authService.forgotPassword(formData.email);
      setMessage("Email de réinitialisation envoyé ! Vérifiez votre boîte mail.");
    } catch (err) {
      setError("Erreur lors de l'envoi de l'email");
      console.error(err);
    }

    setLoading(false);
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    setLoading(true);
    setError("");

    try {
      if (provider === "google") {
        await authService.loginWithGoogle();
        return;
      }

      await authService.loginWithGithub();
    } catch (err) {
      setError(`Erreur lors de la connexion ${provider}`);
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {mode === "login" && "Se connecter"}
        {mode === "register" && "S'inscrire"}
        {mode === "forgot-password" && "Mot de passe oublié"}
      </h2>

      {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

      {message && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{message}</div>}

      <form
        onSubmit={
          mode === "login" ? handleEmailLogin : mode === "register" ? handleEmailRegister : handleForgotPassword
        }
        className="space-y-4"
      >
        {mode === "register" && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nom complet
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {mode !== "forgot-password" && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        {mode === "register" && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading
            ? "Chargement..."
            : mode === "login"
              ? "Se connecter"
              : mode === "register"
                ? "S&apos;inscrire"
                : "Envoyer l&apos;email"}
        </button>
      </form>

      {mode !== "forgot-password" && (
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocialLogin("google")}
              disabled={loading}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Google
            </button>
            <button
              onClick={() => handleSocialLogin("github")}
              disabled={loading}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              GitHub
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        {mode === "login" && (
          <>
            <button onClick={() => setMode("register")} className="text-sm text-blue-600 hover:text-blue-500">
              Pas de compte ? S&apos;inscrire
            </button>
            <br />
            <button
              onClick={() => setMode("forgot-password")}
              className="text-sm text-blue-600 hover:text-blue-500 mt-2"
            >
              Mot de passe oublié ?
            </button>
          </>
        )}
        {mode === "register" && (
          <button onClick={() => setMode("login")} className="text-sm text-blue-600 hover:text-blue-500">
            Déjà un compte ? Se connecter
          </button>
        )}
        {mode === "forgot-password" && (
          <button onClick={() => setMode("login")} className="text-sm text-blue-600 hover:text-blue-500">
            Retour à la connexion
          </button>
        )}
      </div>
    </div>
  );
}
