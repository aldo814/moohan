@AGENTS.md

# 다국어 홈페이지 프로젝트 (mthome.hankyeul.com)

URL 경로 기반으로 언어가 전환되는 다국어 홈페이지. 지원 언어 4개: `/ko` 한국어(기본), `/en` 영어, `/ja` 일본어, `/zh` 중국어.
아직 구현 전 단계이며, 이 문서는 구현 시 따라야 할 설계 가이드다.

## 작업 관리 (PLAN.md / PROGRESS.md) — 반드시 먼저 읽을 것

여러 에이전트가 작업을 나눠 진행한다. 조율은 이 저장소의 두 파일로 한다:

- **`PLAN.md`** — 해야 할 일. 작업 항목을 우선순위 순으로 나열하고, 항목별 범위·의존관계를 적는다.
- **`PROGRESS.md`** — 진행 상황. 완료된 일, 현재 진행 중인 일(담당 중인 에이전트가 있으면 표시), 결정 사항, 막힌 부분을 기록한다.

**세션 시작 시 규칙:**
1. 코드를 만지기 전에 `PLAN.md`와 `PROGRESS.md`를 **먼저 읽는다** (파일이 없으면 이 CLAUDE.md를 기준으로 생성부터 한다).
2. PROGRESS.md에서 이미 완료/진행 중인 작업은 중복 착수하지 않는다. PLAN.md에서 다음 미착수 항목을 골라 시작한다.
3. 작업을 시작하면 PROGRESS.md에 "진행 중"으로 기록하고, 마치면 완료 처리 + 결과(생성/수정한 파일, 내린 결정)를 한두 줄로 남긴다.
4. 계획이 바뀌거나 새 작업이 생기면 PLAN.md를 갱신한다. 두 파일은 항상 실제 상태와 일치해야 한다.
5. 설계 원칙(이 문서)과 충돌하는 내용을 발견하면 임의로 진행하지 말고 PROGRESS.md의 "막힌 부분"에 기록한다.

### 프로젝트 도구 (`.claude/` — 자율 사용 가능)

**Skills** (slash command로도, 에이전트가 자율적으로도 호출 가능):
- `/status` — PLAN/PROGRESS 요약 · `/next` — 다음 작업 착수 기록(파일 없으면 생성) · `/done` — 완료 처리
- `/add-page <경로>` — 다국어 페이지 스캐폴딩 · `/add-lang <코드>` — 언어 추가 · `/i18n-check` — 규칙 검증 · `/deploy-restart` — 빌드 후 서비스 재시작

**Subagents** (작업 위임 대상): `page-builder`(페이지+사전 키 한 세트), `translator`(en/ja/zh 번역 전담), `i18n-auditor`(읽기 전용 감사), `backend-dev`(FastAPI 전담)

**Hooks** (자동 실행): SessionStart에 PLAN/PROGRESS 자동 주입, `src/i18n/` 수정 시 tsc 자동 검증(실패하면 차단됨), Stop 시 PROGRESS.md 갱신 여부 점검. 작업 성격에 맞는 skill/subagent가 있으면 직접 하지 말고 그것을 사용한다.

## 기술 스택 (이미 셋업됨)

- Next.js 16.3 (App Router) + React 19 + TypeScript
- Tailwind CSS v4, shadcn/ui (@base-ui/react 기반), lucide-react
- dev/start 포트: **8178** (systemd 서비스 `mthome.hankyeul.com-frontend.service`로 운영, 재시작은 `~/restart.sh`)
- 백엔드: FastAPI (`~/backend`) — 문의 접수 저장(SQLite) 및 관리자 인증/조회 API 담당
- **주의**: 이 Next.js 버전은 학습 데이터와 다를 수 있음. 코드 작성 전 `node_modules/next/dist/docs/`의 관련 가이드를 먼저 읽을 것 (상단 AGENTS.md 참조)

## 다국어(i18n) 아키텍처

외부 i18n 라이브러리 없이 App Router의 동적 세그먼트로 직접 구현한다 (의존성 최소화, 구조 단순화).

### 라우팅

- 모든 페이지는 `src/app/[lang]/` 아래에 둔다. 언어별로 페이지를 복제하지 않는다 — **페이지(레이아웃)는 하나, 텍스트만 언어별 사전에서 주입**.
- `/` 접속 시 `src/proxy.ts`에서 기본 언어로 redirect: `/` → `/ko` (Next 16에서 middleware.ts가 proxy.ts로 개명됨 — 구현 완료)
- `generateStaticParams`로 지원 언어를 정적 생성하고, 미지원 locale은 404 처리
- 언어 코드는 ISO 639-1 사용: `ko`, `en`, `ja`, `zh` (URL에 `/jpn`, `/cn` 같은 비표준 코드 대신 2글자 언어 코드 표준 사용 — 중국어는 국가코드 `cn`이 아닌 `zh`)

### 언어 설정 단일화

`src/i18n/config.ts` 한 곳에서만 언어 목록을 관리한다. 언어 추가/제거는 이 파일 + 사전 파일 하나로 끝나야 한다.

```ts
export const locales = ["ko", "en", "ja", "zh"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ko";
```

### 번역 사전 (언어쌍 구조의 핵심)

- `src/i18n/dictionaries/ko.ts`, `en.ts`, `ja.ts`, `zh.ts` — **언어당 파일 하나**, 모든 파일이 동일한 키 구조를 가진다.
- `ko.ts`를 기준 타입으로 삼아 나머지 언어에 `satisfies typeof ko`(또는 공유 `Dictionary` 타입)를 적용 → 키가 빠지거나 어긋나면 **컴파일 타임에 오류**. 이것이 "언어쌍으로 적용되어 수정되기 쉬운 구조"의 핵심 장치다.
- 키는 페이지/섹션 단위로 중첩: `home.hero.title`, `about.contact.email` 등. 문구 수정 시 각 언어 파일에서 같은 경로의 키만 고치면 된다.
- 사전 로딩: `src/i18n/get-dictionary.ts`에서 locale별 dynamic import. 서버 컴포넌트에서 `const t = await getDictionary(lang)`로 받아 props로 내려준다.
- 번역문 안에 HTML/JSX를 넣지 않는다. 문장 단위 문자열만 저장하고 마크업은 컴포넌트에서 처리.

### 컴포넌트 규칙

- 기본은 서버 컴포넌트 + 사전 객체(또는 필요한 하위 트리만) props 전달. 클라이언트 컴포넌트에는 필요한 문자열만 좁혀서 넘긴다.
- 하드코딩된 사용자 노출 문자열 금지 — 모든 텍스트는 사전에서 온다. 리뷰 시 이 규칙 위반을 우선 확인할 것.
- 언어 전환 UI(LanguageSwitcher): 현재 경로에서 `[lang]` 세그먼트만 치환해 이동. 페이지 상태 유지를 위해 `usePathname` 기반으로 구현.

### SEO / 메타데이터

- `generateMetadata`에서 lang별 title/description을 사전에서 가져온다.
- `<html lang={...}>`을 `[lang]/layout.tsx`(루트 레이아웃)에서 설정.
- `alternates.languages`로 hreflang 상호 링크 제공.

## 페이지 구조: 원페이지 랜딩

- 별도 하위 페이지를 두지 않는다. **`[lang]/page.tsx` 하나가 랜딩 페이지**이고, 섹션들(hero, 소개, …, contact)을 세로로 쌓아 스크롤로 이동한다.
- 각 섹션은 `src/components/sections/`에 컴포넌트로 분리하고, `id` 앵커(`#about`, `#contact` 등)를 부여한다.
- 상단 네비게이션은 앵커 링크로 해당 섹션에 스크롤 이동. 네비 라벨도 전부 사전에서.
- 언어 전환 시에도 원페이지 구조이므로 `[lang]` 세그먼트만 치환하면 된다 (LanguageSwitcher 기존 로직 유지).

## Contact Us (문의 접수 — 랜딩 내 섹션)

- 별도 페이지가 아니라 **랜딩 페이지 하단의 `#contact` 섹션**이다. 문의 폼(이름, 이메일, 제목, 내용 등)을 포함하며, 라벨/플레이스홀더/성공·실패 메시지 전부 사전에서 가져온다. 폼 제출은 클라이언트 컴포넌트로 처리.
- 제출은 FastAPI 백엔드(`~/backend`)로 전송: `POST /api/inquiries`. 프론트에서 최소 검증(필수값, 이메일 형식) 후 서버에서도 검증.
- 백엔드 저장은 SQLite로 시작한다 (파일 DB, 규모상 충분). 저장 필드: id, name, email, subject, message, lang(작성 당시 언어), created_at, read 여부.
- 스팸 대비 최소 장치(honeypot 필드 또는 rate limit) 하나는 넣는다.

## 관리자 페이지 (`/managed`)

- 접수된 문의를 확인하는 관리자 전용 라우트. **`[lang]/` 밖에 둔다** — 다국어 대상이 아니며 사전 규칙도 적용하지 않는다 (한국어 고정 UI).
- 경로: `src/app/managed/` — 로그인 페이지 + 문의 목록/상세.
- 인증: 단일 관리자 계정으로 시작. 백엔드에서 로그인 처리(`POST /api/admin/login`) 후 httpOnly 세션 쿠키 발급. 비밀번호는 `backend/.env`에 해시로 보관, 코드에 하드코딩 금지.
- 문의 조회 API(`GET /api/admin/inquiries` 등)는 전부 인증 필수. 프론트 `src/proxy.ts`에서도 `/managed` 하위는 세션 없으면 로그인으로 redirect (locale redirect와 같은 proxy 파일에서 분기 처리). `/managed`는 `[lang]` root layout 밖이므로 `app/managed/layout.tsx`에 html/body를 포함한 자체 root layout을 둔다.
- 기능 범위(초기): 문의 목록(최신순, 읽음/안읽음 표시), 상세 보기, 읽음 처리. 그 이상은 필요해질 때 추가.

### 예상 디렉터리 구조

```
src/
  proxy.ts              # / → /ko redirect + (예정) /managed 인증 가드
  app/
    [lang]/
      layout.tsx        # html lang 설정, 공통 레이아웃, generateStaticParams
      page.tsx          # 랜딩 원페이지 (섹션 컴포넌트 조립)
    managed/
      layout.tsx        # 관리자 레이아웃 (다국어 미적용)
      login/page.tsx    # 관리자 로그인
      page.tsx          # 문의 목록
      [id]/page.tsx     # 문의 상세
  i18n/
    config.ts           # locales / defaultLocale (유일한 언어 목록 정의처)
    get-dictionary.ts   # locale → 사전 dynamic import
    dictionaries/
      ko.ts             # 기준 사전 (타입의 원천)
      en.ts             # satisfies Dictionary
      ja.ts             # satisfies Dictionary
      zh.ts             # satisfies Dictionary
  components/
    sections/           # 랜딩 섹션 컴포넌트 (hero, about, contact ...)
    ...                 # 공용 컴포넌트 (shadcn/ui, LanguageSwitcher 등)
```

## 작업 원칙

- 새 콘텐츠 추가 시: 원칙적으로 **랜딩에 섹션 추가** (`components/sections/` 컴포넌트 + 사전에 섹션 키 + 앵커 네비 항목). 별도 페이지가 정말 필요한 경우에만 `[lang]/` 아래에 페이지 1개 생성 (언어 수만큼 페이지를 만들지 않는다)
- 새 언어 추가 시: `config.ts`의 `locales`에 코드 추가 + `dictionaries/<code>.ts` 생성, 그 외 코드는 수정 불필요해야 한다
- 번역이 아직 없는 문구는 기본 언어(ko) 문구로 채워두고 `// TODO: translate` 주석을 남긴다
