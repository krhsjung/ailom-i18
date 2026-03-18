# ailom-i18n

Ailom 프로젝트의 다국어 리소스를 중앙 관리하는 레포지토리.

## 구조

```
ailom-i18n/
├── home.csv                    — Ailom Home 클라이언트 번역 마스터 (14개 언어)
├── server.csv                  — API 서버 번역 마스터 (에러, 이메일 템플릿)
├── scripts/
│   └── generate-i18n.js        — CSV → 플랫폼별 파일 생성
├── translations/               — 생성된 파일 (gitignore)
└── CLAUDE.md
```

## 지원 언어 (14개)

`en`, `ko`, `ja`, `zh-Hant`, `th`, `id`, `fr`, `de`, `es`, `it`, `pt`, `tr`, `ru`, `ar`

## 사용법

```bash
npm run generate:home      # home.csv → ios/, android/, react/
npm run generate:server    # server.csv → server/
```

실행 시 `translations/` 내부를 비우고 해당 서비스 파일만 생성한다.

## 서비스별 출력

### home (클라이언트)

| 플랫폼 | 출력 경로 | 파일명 규칙 | 비고 |
|--------|-----------|-------------|------|
| iOS | `translations/ios/` | `{PascalCase}.xcstrings` | `{{platform}}` → "iOS" |
| Android | `translations/android/values[-{lang}]/` | `strings_{module}.xml` | `{{platform}}` → "Android" |
| React | `translations/react/{lang}/` | `{module}.json` | `{{platform}}` → "Web" |

### server (API 서버)

| 플랫폼 | 출력 경로 | 파일명 규칙 | 비고 |
|--------|-----------|-------------|------|
| Server | `translations/server/{lang}/` | `{module}.json` | `{{platform}}` 제거 |

## 규칙

- 마스터 파일 포맷: CSV (`module,key,en,ko,ja,zh-Hant,th,id,fr,de,es,it,pt,tr,ru,ar`)
- 주석 행: key 컬럼에 `# 주석` 형태 (Android XML 주석으로 보존)
- 키 추가/삭제 시 모든 언어 컬럼에 동시 반영
- 키 네이밍: snake_case, 섹션별 접두사 (`login_`, `error_`, `email_`, `home_`, `camera_` 등)
- `{{platform}}` 변수: 플랫폼별 자동 치환 (서버는 제거)
- 브랜드 톤 필수 적용 (감시→돌봄, 추적→위치 확인, 경고→알림)
- `translations/` 디렉토리는 gitignore — 항상 생성 스크립트로 재생성

## 서버 연동

서버 번역은 `server.csv`에서 독립 관리되며, `translations/server/{lang}/{module}.json`으로 생성된다.
서버에서 `Accept-Language` 헤더를 파싱하여 해당 언어의 JSON을 로드해 사용한다.

포함 모듈:
- `auth`: 이메일 템플릿 (`email_verification_*`), API 응답 메시지 (`verification_code_sent`)
- `error`: 인증 에러 + 일반 HTTP 에러 메시지

## 에이전트 상세 지침

[Ailom/agents/i18n.md](https://github.com/krhsjung/Ailom/blob/main/agents/i18n.md) 참조
