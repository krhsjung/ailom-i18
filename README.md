# ailom-i18n

Ailom 프로젝트의 다국어 리소스를 중앙 관리하고, 각 플랫폼(iOS, Android, React)에 맞는 번역 파일을 생성합니다.

## 구조

```
ailom-i18n/
├── home.csv                    — Ailom Home 번역 마스터 (module,key,en,ko)
├── scripts/
│   └── generate-i18n.js        — CSV → 플랫폼별 파일 생성
├── translations/               — 생성된 파일 (gitignore)
├── CLAUDE.md
└── README.md
```

## 마스터 파일 포맷

CSV 형식으로 모든 언어를 하나의 파일에서 관리합니다.

```csv
module,key,en,ko
common,back,Back,뒤로
auth,# Login Page,,
auth,login_slogan,"Peace of Mind, Woven into Everyday Life.",일상에 스며드는 안심.
```

- `module`: 모듈명 (common, auth, error 등)
- `key`: 번역 키 (snake_case) 또는 `# 주석` (섹션 구분)
- `en`, `ko`, ...: 언어별 번역값
- 값에 쉼표가 포함된 경우 큰따옴표로 감싸기

## 사용법

```bash
npm run generate:home      # home.csv → translations/{ios,android,react}/
```

실행 시 `translations/` 내부를 비우고 해당 서비스 파일만 생성합니다.

## 출력 포맷

| 플랫폼 | 출력 경로 | 파일명 규칙 |
|--------|-----------|-------------|
| iOS | `translations/ios/` | `{PascalCase}.xcstrings` |
| Android | `translations/android/values[-{lang}]/` | `strings_{module}.xml` |
| React | `translations/react/{lang}/` | `{module}.json` |

## 언어 추가

1. CSV 파일에 새 언어 컬럼 추가 (예: `module,key,en,ko,ja`)
2. 모든 행에 번역값 채우기
3. 생성 스크립트는 헤더 기반 자동 감지이므로 스크립트 수정 불필요

## 변수 치환

`{{platform}}` 변수를 사용하면 플랫폼별 이름으로 자동 치환됩니다.

| 플랫폼 | 치환값 |
|--------|--------|
| iOS | `iOS` |
| Android | `Android` |
| React | `Web` |
