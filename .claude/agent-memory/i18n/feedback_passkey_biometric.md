---
name: feedback_passkey_biometric
description: passkey 카피에서 biometric/지문/얼굴/Face ID/Touch ID/password 표현 금지 — "패스키" 용어만 사용
metadata:
  type: feedback
---

A4 Passkey 화면 및 passkey 관련 모든 카피에서 "biometric", "지문", "얼굴 인식", "Face ID", "Touch ID", "생체 인증", "fingerprint" 표현을 사용하면 안 된다.

**Why:** Auth Baseline §7.2 및 사용자 지시. "패스키 = 기기에 안전하게 저장된 인증 정보"라는 풀이만 허용.

**How to apply:** 기존 `signup_passkey_suggest_body`(line 264)에 "Face ID·지문/fingerprint" 표현이 있어 stale 키로 보고 대상. 신규 `passkey_offer_body`는 이 규칙을 준수하여 작성함. "MFA"·"2단계 인증" 표현도 금지(MSEC-24).
