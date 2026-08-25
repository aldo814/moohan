---
name: add-lang
description: 지원 언어를 추가한다 — config.ts의 locales에 코드 추가 + 사전 파일 생성. 새 언어 지원 요청 시 사용.
argument-hint: "<ISO 639-1 코드 예: zh, fr>"
arguments: [code]
---

`$code` 언어를 추가한다. 설계 원칙상 **파일 두 개 수정으로 끝나야 한다**:

1. `$code`가 ISO 639-1 2글자 코드인지 확인한다 (아니면 표준 코드를 제안하고 확인 후 진행).
2. `src/i18n/config.ts`의 `locales` 배열에 `$code`를 추가한다.
3. `src/i18n/dictionaries/$code.ts`를 생성한다 — `ko.ts`의 전체 구조를 복사하고, 각 문자열에 `// TODO: translate` 주석을 남긴다. `satisfies` 타입 제약을 반드시 적용한다.
4. `npx tsc --noEmit`으로 검증한다.
5. 위 두 파일 외에 다른 코드를 수정해야 했다면 **설계 위반이다** — 무엇을 왜 고쳤는지 PROGRESS.md의 `## 막힌 부분`에 기록하고 보고한다 (locale 하드코딩이 어딘가 있다는 뜻).
6. 번역은 translator subagent에 위임하고, PROGRESS.md에 기록한다 (/done 절차).
