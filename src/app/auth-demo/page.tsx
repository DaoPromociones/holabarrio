"use client";

import { useEffect, useState } from "react";
import { diContainer } from "@/lib/di-container";
import { User } from "@/core/models/user";
import BetterAuthForm from "@/components/BetterAuthForm";

export default function AuthDemo() {
  const [user, setUser] = useState<User | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const authService = diContainer.get("AuthService");

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Erreur d'authentification"));
      }
      setIsPending(false);
    };

    initAuth();

    authService.onAuthStateChanged((newUser: User | null) => {
      setUser(newUser);
      setIsPending(false);
    });
  }, [authService]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Erreur</h2>
            <p className="text-gray-600">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-green-600">✅</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Bienvenue, {user.displayName || user.email} !</h1>
              <p className="text-gray-600">Vous êtes connecté avec succès.</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations du compte</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Email :</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nom :</span>
                  <span className="font-medium">{user.displayName || "Non défini"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ID :</span>
                  <span className="font-mono text-sm">{user.id}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Actualiser les données
              </button>
              <button
                onClick={() => authService.logout()}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Démonstration Better-Auth + Resend</h1>
          <p className="text-xl text-gray-600 mb-2">Architecture hexagonale avec Next.js</p>
          <p className="text-gray-500">Testez toutes les fonctionnalités d&apos;authentification intégrées</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <BetterAuthForm />
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Fonctionnalités incluses</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">🔐</span>
                  <div>
                    <p className="font-medium">Authentification complète</p>
                    <p className="text-sm text-gray-600">Connexion/inscription avec email, Google, et GitHub</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">📧</span>
                  <div>
                    <p className="font-medium">Emails automatiques</p>
                    <p className="text-sm text-gray-600">
                      Vérification d&apos;email et réinitialisation de mot de passe via Resend
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">🏗️</span>
                  <div>
                    <p className="font-medium">Architecture hexagonale</p>
                    <p className="text-sm text-gray-600">Séparation claire entre logique métier et infrastructure</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">🔄</span>
                  <div>
                    <p className="font-medium">Injection de dépendances</p>
                    <p className="text-sm text-gray-600">DI Container pour une meilleure testabilité</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
