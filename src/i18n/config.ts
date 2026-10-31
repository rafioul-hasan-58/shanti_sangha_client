export const locales = ["bn", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "bn";

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);
