---
name: next
description: PLAN.md에서 다음 미착수 작업을 골라 PROGRESS.md에 "진행 중"으로 기록하고 착수한다. 새 작업을 시작할 때 반드시 이 절차를 거친다 (중복 착수 방지).
---

다음 작업 착수 절차:

1. `PLAN.md`와 `PROGRESS.md`를 읽는다.
   - **파일이 없으면**: CLAUDE.md의 설계 가이드를 기준으로 두 파일을 생성한다. PLAN.md에는 CLAUDE.md에서 도출한 작업 항목을 우선순위 순으로(범위·의존관계 포함), PROGRESS.md에는 `## 완료`, `## 진행 중`, `## 결정 사항`, `## 막힌 부분` 섹션 골격을 만든다.
2. PROGRESS.md의 "진행 중"에 이미 있는 작업은 건드리지 않는다. PLAN.md에서 **미착수 항목 중 의존관계가 해소된 최우선 항목**을 고른다.
   - 인수(ARGUMENTS)로 특정 작업이 지정됐으면 그 작업을 고른다.
3. 고른 작업을 PROGRESS.md의 `## 진행 중`에 한 줄로 기록한다: `- [작업명] — 착수: <오늘 날짜>, 범위: <한 줄>`
4. 기록 후 즉시 작업에 착수한다. 작업 성격에 맞는 subagent(page-builder, translator, backend-dev)가 있으면 위임을 고려한다.
5. 작업이 끝나면 /done 절차로 마무리한다.

$ARGUMENTS
