// 기준 사전 — 모든 언어 파일의 키 구조는 이 파일을 따른다 (CLAUDE.md 참조).
// 새 키는 반드시 여기에 먼저 추가한 뒤 en/ja/zh에 동일 구조로 추가할 것.
export const ko = {
  meta: {
    siteName: "mthome",
    home: {
      title: "홈",
      description: "다국어 홈페이지입니다.",
    },
  },
  common: {
    languageSwitcher: {
      label: "언어 선택",
    },
  },
  home: {
    hero: {
      title: "환영합니다1",
      subtitle: "사이트 소개 문구가 들어갑니다.2",
    },
  },
};

export type Dictionary = typeof ko;
