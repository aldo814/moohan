---
name: add-page
description: "[lang]/ 아래 새 다국어 페이지를 표준 규칙대로 스캐폴딩한다 — 페이지 1개 생성 + 전체 언어 사전 파일에 섹션 키 추가 + generateMetadata. 새 페이지를 추가할 때 사용."
argument-hint: "<페이지경로 예: about, products/detail>"
arguments: [page]
---

`$page` 페이지를 CLAUDE.md 설계 규칙대로 스캐폴딩한다:

1. 작업 전 `node_modules/next/dist/docs/`에서 관련 가이드(라우팅, metadata)를 확인한다.
2. `src/app/[lang]/$page/page.tsx` 생성:
   - 서버 컴포넌트, `const t = await getDictionary(lang)`으로 사전 주입
   - `generateMetadata`에서 lang별 title/description을 사전에서 가져옴
   - 언어별 페이지 복제 금지 — 페이지는 하나
3. `src/i18n/dictionaries/ko.ts`에 `$page` 섹션 키를 추가 (실제 문구는 자리표시 수준이라도 ko로 작성). 나머지 언어 파일(`en.ts`/`ja.ts`/`zh.ts`)에 동일 구조로 추가하되 번역이 없으면 ko 문구 + `// TODO: translate` 주석 (본격 번역은 translator subagent에 위임 가능).
4. 사용자 노출 문자열 하드코딩 금지 — 전부 사전 경유.
5. `npx tsc --noEmit`으로 사전 키 일치를 검증한다.
6. PROGRESS.md에 결과를 기록한다 (/done 절차).

i18n 기반 구조(config.ts, get-dictionary.ts, `[lang]/layout.tsx`)가 아직 없다면 이 skill 실행 전에 그것부터 만들어야 함을 알리고, PLAN.md 우선순위에 따라 진행한다.
