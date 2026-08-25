# PLAN — 다국어 홈페이지 (mthome.hankyeul.com)

우선순위 순. 설계 기준은 CLAUDE.md.

## 1. i18n 기반 구조 (다른 모든 프론트 작업의 선행 조건)
- [x] `src/i18n/config.ts` — locales(ko/en/ja/zh), defaultLocale
- [x] `src/i18n/dictionaries/{ko,en,ja,zh}.ts` — 기준 사전 + satisfies 구조
- [x] `src/i18n/get-dictionary.ts` — locale별 dynamic import

## 2. [lang] 라우팅 전환
- [x] 기존 `src/app/page.tsx`/`layout.tsx`를 `src/app/[lang]/` 구조로 이전
- [x] `[lang]/layout.tsx` — `<html lang>`, generateStaticParams, 미지원 locale 404
- [x] `src/proxy.ts` — `/` → `/ko` redirect (Next 16: middleware → proxy로 개명됨)
- [x] LanguageSwitcher 컴포넌트 (usePathname 기반 [lang] 세그먼트 치환)
- [x] 실서비스 반영 (restart.sh — sudo 비밀번호 없이 실행 가능하도록 설정됨)

## 3. 랜딩 원페이지 (홈 = 전체 콘텐츠)
- [x] `[lang]/page.tsx` — 사전 주입 렌더, generateMetadata, hreflang (기본 골격은 #2에서 완료)
- [ ] 섹션 구성 확정 (hero / 소개 / … / contact — 사용자와 협의) 후 `components/sections/`로 분리
- [ ] 앵커 네비게이션 (#about, #contact 스크롤 이동, 라벨은 사전)
- [ ] contact 섹션: 문의 폼 (라벨/메시지 전부 사전, 제출은 클라이언트 컴포넌트 → backend API)
- [ ] 사전 실제 문구 작성 (ko) → translator로 en/ja/zh

## 4. Contact 백엔드
- [ ] backend: `POST /api/inquiries` + SQLite 스키마 + 스팸 방지 (담당: backend-dev, 프론트와 독립 진행 가능)

## 5. 관리자 (/managed)
- [ ] backend: 관리자 인증 (`POST /api/admin/login`, 세션 쿠키, .env 해시)
- [ ] backend: 문의 조회 API (목록/상세/읽음 처리, 인증 필수)
- [ ] `app/managed/` — 로그인, 목록, 상세 (다국어 미적용, 한국어 고정)
- [ ] middleware에 /managed 인증 가드 추가 (2번의 locale redirect와 같은 파일에서 분기)
- [ ] CORS를 실제 origin으로 축소 (인증 쿠키 도입 시점)

## 의존관계
- 3(contact 섹션 폼 제출)은 4(backend API 계약)에 의존 — 폼 UI 자체는 먼저 만들 수 있음.
- 4(backend)와 5(backend)는 독립 진행 가능. 5(프론트 /managed)는 5(backend) API 계약 확정 후.
