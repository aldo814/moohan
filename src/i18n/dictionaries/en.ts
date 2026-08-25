import type { Dictionary } from "./ko";

export const en = {
  meta: {
    siteName: "mthome",
    home: {
      title: "Home",
      description: "A multilingual homepage.",
    },
  },
  common: {
    languageSwitcher: {
      label: "Select Language",
    },
  },
  home: {
    hero: {
      title: "Welcome",
      subtitle: "Site introduction goes here.", // TODO: translate — 실제 소개 문구 확정 후 갱신
    },
  },
} satisfies Dictionary;
