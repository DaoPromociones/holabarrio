import { User } from "@/core/models/user";
import { AuthPortIn } from "@/core/ports/in/auth.port";
import { AuthRepository } from "@/core/ports/out/auth.repository";

export class AuthService implements AuthPortIn {
  private readonly authRepo: AuthRepository;

  public constructor(authRepo: AuthRepository) {
    this.authRepo = authRepo;
  }

  public async loginWithEmail(email: string, password: string): Promise<User | null> {
    return this.authRepo.loginWithEmail(email, password);
  }

  public async registerWithEmail(
    email: string,
    password: string,
    name: string
  ): Promise<{ user: User | null; requiresVerification: boolean }> {
    return this.authRepo.registerWithEmail(email, password, name);
  }

  public async loginWithGoogle(): Promise<User | null> {
    return this.authRepo.loginWithGoogle();
  }

  public async loginWithGithub(): Promise<User | null> {
    return this.authRepo.loginWithGithub();
  }

  public async forgotPassword(email: string): Promise<void> {
    return this.authRepo.forgotPassword(email);
  }

  public async resetPassword(token: string, password: string): Promise<boolean> {
    return this.authRepo.resetPassword(token, password);
  }

  public async verifyEmail(token: string): Promise<boolean> {
    return this.authRepo.verifyEmail(token);
  }

  public async resendVerificationEmail(email: string): Promise<void> {
    return this.authRepo.resendVerificationEmail(email);
  }

  public async getCurrentUser(): Promise<User | null> {
    return this.authRepo.getCurrentUser();
  }

  public async logout(): Promise<void> {
    return this.authRepo.logout();
  }

  public onAuthStateChanged(callback: (user: User | null) => void): void {
    this.authRepo.onAuthStateChanged(callback);
  }
}
