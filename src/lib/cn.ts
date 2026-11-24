import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/** Joins class values; a later Tailwind utility replaces an earlier one it conflicts with. */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs))
