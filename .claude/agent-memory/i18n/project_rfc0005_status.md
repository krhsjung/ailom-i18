---
name: project_rfc0005_status
description: RFC-0005 A (가입·첫 로그인 A1~A7) i18n 키 home.csv 추가 완료 상태 (2026-07-01)
metadata:
  type: project
---

2026-07-01 기준 RFC-0005 A 화면(A1~A7)의 i18n 키가 home.csv에 추가되었다.

추가된 섹션 주석:
- `# RFC-0005 A — Entry (A1)`
- `# RFC-0005 A — Magic Link (A2)`
- `# RFC-0005 A — Consent (A3)`
- `# RFC-0005 A — Passkey Offer (A4)`
- `# RFC-0005 A — Account Link / Collision (A5)`
- `# RFC-0005 A — Signup Complete / Trust Phrase / Onboarding (A6)`
- `# RFC-0005 A — Under-18 Block (A7)`

**Why:** RFC-0005 A v0.1 화면 RFC 신규 작성 후 i18n agent handoff 요청.

**How to apply:** 이 키들이 이미 있음을 확인하고 중복 추가 금지. Frontend/iOS/Android에서 참조할 준비 완료. 커밋은 사용자 확인 후 메인이 처리.
