import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/ko";

// locale별 dynamic import — 요청된 언어의 사전만 로드된다.
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ko: () => import("./dictionaries/ko").then((m) => m.ko),
  en: () => import("./dictionaries/en").then((m) => m.en),
  ja: () => import("./dictionaries/ja").then((m) => m.ja),
  zh: () => import("./dictionaries/zh").then((m) => m.zh),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
