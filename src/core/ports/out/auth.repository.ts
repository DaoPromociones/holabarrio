import { User } from "@/core/models/user";

export interface AuthRepository {
  // Connexion et inscription avec email/mot de passe
  loginWithEmail(email: string, password: string): Promise<User | null>;
  registerWithEmail(
    email: string,
    password: string,
    name: string
  ): Promise<{ user: User | null; requiresVerification: boolean }>;

  // Connexion sociale
  loginWithGoogle(): Promise<User | null>;
  loginWithGithub(): Promise<User | null>;

  // Gestion des mots de passe
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, password: string): Promise<boolean>;

  // Vérification email
  verifyEmail(token: string): Promise<boolean>;
  resendVerificationEmail(email: string): Promise<void>;

  // Session et déconnexion
  getCurrentUser(): Promise<User | null>;
  logout(): Promise<void>;
  onAuthStateChanged(callback: (user: User | null) => void): void;
}
