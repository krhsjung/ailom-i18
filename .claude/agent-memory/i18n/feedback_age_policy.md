---
name: feedback_age_policy
description: auth 모듈 연령 기준은 18+ 통합 baseline — 14세 관련 키/값을 모두 18로 교체해야 함
metadata:
  type: feedback
---

auth 모듈의 연령 기준은 Auth Baseline §6.3 C15에 의해 18+ 통합 self-declared baseline으로 확정되었다.

**Why:** 기존 CSV에 `consent_label_age_14`, `consent_age_14_blocked`, `consent_age_14_blocked_title` 등 14세 기준 키가 남아있었으며 이를 18+ 값으로 정정해야 했다. (2026-07-01 RFC-0005 A 작업 시 발견)

**How to apply:** auth 모듈에서 "14세/14 years" 언급이 있는 모든 값은 "18세/18 years"로 교체. 키 이름(`consent_label_age_14` 등)은 클라이언트 참조 우려로 유지하되 값만 교체. deprecated 주석 행(line 237~252)은 건드리지 않음.
