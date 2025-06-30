import * as generatePassword from 'generate-password';

export function generateRandomPassword(length = 12): string {
  return generatePassword.generate({
    length: length,
    numbers: true,
    symbols: true,
    uppercase: true,
    lowercase: true
  });
}
