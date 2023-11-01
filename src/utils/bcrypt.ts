import { genSaltSync, hashSync, compareSync } from "bcryptjs";

export const hashPassword = (plaintext: string): string => {
  const salt = genSaltSync(12);
  return hashSync(plaintext, salt);
};

export const vetifyPassword = (plaintext: string, hashVal: string): boolean =>
  compareSync(plaintext, hashVal);
