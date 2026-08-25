# PROGRESS

## 완료

- **[2026-08-20] 언어 전환 UI를 드롭다운으로 교체** (사용자 요청, 시안 이미지 기준): 4개 링크 나열 → 현재 언어 pill 버튼 + ⌄ 펼침 목록(`components/language-switcher.tsx`). 바깥 클릭/Escape/이동 시 닫힘, listbox aria 적용. 빌드 통과 + restart.sh로 실서비스 반영 확인.

- **[2026-08-19] 프로젝트 셋업**: CLAUDE.md 설계 가이드, `.claude/`(agents 4종, skills 7종, hooks), `.gitignore`(frontend 보강 + backend 신규) 작성.
- **[2026-08-20] [lang] 라우팅 전환 (PLAN #2)**: 기존 루트 layout/page 제거 → `app/[lang]/layout.tsx`(html lang, generateStaticParams, dynamicParams=false로 미지원 locale 404, title template), `app/[lang]/page.tsx`(사전 주입 홈, generateMetadata + hreflang/canonical), `src/proxy.ts`(/ → /ko 307), `components/language-switcher.tsx`(usePathname 세그먼트 치환), config.ts에 localeNames 추가. 빌드 통과, 임시 prod 서버(8280)에서 검증: / 307→/ko, 4개 locale 200 + html lang 정상, /xx 404, hreflang 5종 출력. [2026-08-20] restart.sh로 실서비스 반영 완료 — 8178에서 / 307→/ko, 4개 locale 200, /xx 404, 백엔드 health 정상 확인. (restart.sh는 sudo 비밀번호 없이 실행 가능하도록 설정됨)
- **[2026-08-19] i18n 기반 구조 (PLAN #1)**: `src/i18n/config.ts`(locales ko/en/ja/zh, isLocale 가드), `dictionaries/{ko,en,ja,zh}.ts`(ko 기준 + satisfies Dictionary), `get-dictionary.ts`(dynamic import). `tsc --noEmit` 통과. 사전 내용은 자리표시 수준(meta/common/home.hero) — 실제 문구는 PLAN #3에서.

## 진행 중

(없음)

## 결정 사항

- 중국어 코드는 `cn`(국가코드)이 아닌 ISO 639-1 `zh` 사용, 간체자 기준 (사용자 확인됨).
- `Dictionary` 타입은 `ko.ts`에서 `typeof ko`로 export — ko가 유일한 기준.
- Next 16에서 middleware.ts는 deprecated → **`src/proxy.ts`** 컨벤션 사용 (기능 동일, export 이름 `proxy`).
- 언어 자기표기(localeNames)는 관례상 번역 대상이 아니므로 사전이 아닌 `config.ts`에서 관리.
- `/managed`(PLAN #5)는 `[lang]/layout.tsx`가 root layout이므로 **자체 root layout**(`app/managed/layout.tsx`에 html/body 포함)을 만들어야 함 — multiple root layouts 방식.

- [2026-08-20] **원페이지 랜딩 구조로 확정** (사용자 결정): 별도 하위 페이지 없이 `[lang]/page.tsx` 하나에 섹션들을 쌓고 앵커 스크롤로 이동. contact도 별도 페이지가 아닌 `#contact` 섹션. CLAUDE.md/PLAN.md 반영됨.

## 막힌 부분

(없음)
