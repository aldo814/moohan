import type { Dictionary } from "./ko";

export const zh = {
  meta: {
    siteName: "mthome",
    home: {
      title: "首页",
      description: "多语言主页。",
    },
  },
  common: {
    languageSwitcher: {
      label: "选择语言",
    },
  },
  home: {
    hero: {
      title: "欢迎",
      subtitle: "此处为网站介绍文字。", // TODO: translate — 실제 소개 문구 확정 후 갱신
    },
  },
} satisfies Dictionary;
