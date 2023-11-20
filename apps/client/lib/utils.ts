import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const alphabet = "abcdefghijklmnopqrstuvwxyz";
export function formatNumberWithZero(integer: number): string {
  if (integer < 10) return `0${Math.abs(integer).toFixed(0)}`;
  return integer.toFixed(0);
}
export function removeCopy<T>(array: T[]): T[] {
  return array.filter((value, index, self) => self.indexOf(value) === index);
}
export function getInitialLetter(name: string): string {
  var initialLetter = "";
  name
    .split(" ")
    .forEach((word, index) =>
      index < 2 ? (initialLetter += word[0].toUpperCase()) : null
    );
  return initialLetter;
}
