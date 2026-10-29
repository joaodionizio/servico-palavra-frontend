export const PASSWORD_REQUIREMENTS = "Use pelo menos 6 caracteres, com letra maiúscula, letra minúscula e número.";

export function isStrongEnoughPassword(password: string) {
  return password.length >= 6 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);
}
