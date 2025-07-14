export interface EmailRepository {
  sendVerificationEmail(email: string, token: string, name: string): Promise<void>;
  sendPasswordResetEmail(email: string, token: string, name: string): Promise<void>;
}
