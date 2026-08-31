export const locales = ["ko", "en", "ja", "zh"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// 언어 전환 UI에 표시할 각 언어의 자기 언어 표기 (관례상 번역하지 않으므로 사전이 아닌 여기서 관리)
export const localeNames: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  zh: "中文",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
