"use client";

import { authClient } from "@/lib/auth-client";

export default function AuthDemo() {
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  console.log("error", error);
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/auth-better-demo",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Une erreur est survenue lors de la connexion";
      console.error(message);
    }
  };

  if (session) {
    return (
      <div className="flex flex-col items-center justify-center p-24">
        Connected as {session.user.email}
        <button
          className="bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow hover:bg-gray-100"
          onClick={() => refetch()}
        >
          Refetch
        </button>
        <button
          className="bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow hover:bg-gray-100"
          onClick={() => authClient.signOut()}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Démonstration d&apos;authentification</h1>
      <button
        onClick={handleGoogleSignIn}
        className="bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow hover:bg-gray-100"
      >
        Se connecter avec Google
      </button>
    </main>
  );
}
