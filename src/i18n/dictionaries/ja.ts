import type { Dictionary } from "./ko";

export const ja = {
  meta: {
    siteName: "mthome",
    home: {
      title: "ホーム",
      description: "多言語ホームページです。",
    },
  },
  common: {
    languageSwitcher: {
      label: "言語を選択",
    },
  },
  home: {
    hero: {
      title: "ようこそ",
      subtitle: "サイト紹介文が入ります。", // TODO: translate — 실제 소개 문구 확정 후 갱신
    },
  },
} satisfies Dictionary;
