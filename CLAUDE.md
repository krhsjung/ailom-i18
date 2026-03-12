# ailom-i18n

Ailom 프로젝트의 다국어 리소스를 중앙 관리하는 레포지토리.

## 구조

```
ailom-i18n/
├── home.csv                    — Ailom Home 번역 마스터 (module,key,en,ko)
├── scripts/
│   └── generate-i18n.js        — CSV → 플랫폼별 파일 생성
├── translations/               — 생성된 파일 (gitignore)
└── CLAUDE.md
```

## 사용법

```bash
npm run generate:home      # home.csv → ios/, android/, react/
```

실행 시 `translations/` 내부를 비우고 해당 서비스 파일만 생성한다.

## 규칙

- 마스터 파일 포맷: CSV (`module,key,en,ko`)
- 주석 행: key 컬럼에 `# 주석` 형태 (Android XML 주석으로 보존)
- 키 추가/삭제 시 모든 언어 컬럼에 동시 반영
- 키 네이밍: snake_case, 섹션별 접두사 (`login_`, `error_`, `home_`, `camera_` 등)
- `{{platform}}` 변수: iOS → "iOS", Android → "Android", React → "Web"
- 브랜드 톤 필수 적용 (감시→돌봄, 추적→위치 확인, 경고→알림)
- `translations/` 디렉토리는 gitignore — 항상 생성 스크립트로 재생성

## 에이전트 상세 지침

[Ailom/agents/i18n.md](https://github.com/krhsjung/Ailom/blob/main/agents/i18n.md) 참조
