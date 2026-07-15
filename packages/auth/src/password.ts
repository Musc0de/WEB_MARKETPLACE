import { Argon2id } from 'oslo/password';

const argon2id = new Argon2id();

export const passwordPolicy = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
};

export function validatePasswordStrength(password: string): boolean {
  if (password.length < passwordPolicy.minLength) return false;
  if (password.length > passwordPolicy.maxLength) return false;

  if (passwordPolicy.requireUppercase && !/[A-Z]/.test(password)) return false;
  if (passwordPolicy.requireLowercase && !/[a-z]/.test(password)) return false;
  if (passwordPolicy.requireNumber && !/[0-9]/.test(password)) return false;

  return true;
}

export async function hashPassword(password: string): Promise<string> {
  return await argon2id.hash(password);
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  return await argon2id.verify(hash, password);
}
