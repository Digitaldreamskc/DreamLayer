import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string, length = 4): string {
  if (!address) return "";
  if (address.length < 10) return address;
  return `${address.substring(0, length)}...${address.substring(address.length - length)}`;
}

export function formatBalance(balance: number | string, decimals = 4): string {
  if (typeof balance === "string") {
    balance = parseFloat(balance);
  }
  
  if (isNaN(balance)) return "0.00";
  
  return balance.toFixed(decimals).replace(/\.?0+$/, "");
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function generateRandomId(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}
