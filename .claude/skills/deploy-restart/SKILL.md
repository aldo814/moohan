---
name: deploy-restart
description: 프로덕션 빌드를 검증한 뒤 systemd 서비스를 재시작해 변경 사항을 반영한다. 코드 변경을 실서비스에 적용할 때 사용.
---

배포/재시작 절차:

1. `cd /home/mthome/frontend && npm run build` — **빌드가 실패하면 여기서 중단**하고 오류를 보고한다. 실패 상태로 재시작하지 않는다.
2. 백엔드를 수정했다면 python 문법 확인(`backend/venv/bin/python -m py_compile backend/main.py` 등)도 거친다.
3. 빌드 성공 시 `~/restart.sh` 실행 (frontend/.next 삭제 + 프론트/백엔드 systemd 재시작, sudo 필요).
4. 재시작 후 확인:
   - `curl -s http://localhost:8178` 응답 확인 (프론트)
   - `curl -s http://localhost:$(grep -oP 'PORT=\K\d+' /home/mthome/backend/.env 2>/dev/null || echo 8000)/api/health` (백엔드 — 포트는 backend/.env 확인)
   - 이상 시 `~/backend.log`, `~/frontend.log` 확인
5. 결과(성공/실패, 확인한 응답)를 보고한다.
