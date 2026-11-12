import type { Locale } from "./config";
import type en from "./dictionaries/en.json";
import { FULL_BRAND_NAME_EN } from "@/lib/constants/site";

export type Dictionary = typeof en;

const dictionaries = {
  en: () =>
    import("./dictionaries/en.json").then((m) => ({
      ...m.default,
      meta: {
        ...m.default.meta,
        title: FULL_BRAND_NAME_EN,
      },
      brand: FULL_BRAND_NAME_EN,
      auth: {
        ...m.default.auth,
        loginSubtitle: `Sign in to your ${FULL_BRAND_NAME_EN} account`,
        registerSubtitle: `Join the ${FULL_BRAND_NAME_EN} family`,
      },
    })),
  bn: () => import("./dictionaries/bn.json").then((m) => m.default),
};

export const getDictionary = (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
