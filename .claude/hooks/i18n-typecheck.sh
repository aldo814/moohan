#!/bin/bash
# PostToolUse(Edit|Write) hook: src/i18n/ 아래 파일이 수정되면 tsc로 사전 키 일치 검증.
# 불일치 시 exit 2 → 오류가 에이전트에게 피드백되어 즉시 수정하게 함.
FILE=$(jq -r '.tool_input.file_path // empty' 2>/dev/null)
case "$FILE" in
  */src/i18n/*) ;;
  *) exit 0 ;;
esac

cd "${CLAUDE_PROJECT_DIR:-/home/mthome/frontend}" || exit 0
OUT=$(npx tsc --noEmit 2>&1)
if [ $? -ne 0 ]; then
  {
    echo "i18n 타입체크 실패 — 사전 파일 키 구조가 어긋났을 수 있습니다 (수정 파일: $FILE):"
    echo "$OUT" | head -30
  } >&2
  exit 2
fi
exit 0
