#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 설정
const CONFIG = {
  rootDir: path.join(__dirname, '..'),
  outputDir: path.join(__dirname, '../translations'),
  sourceLanguage: 'en',
  platformNames: {
    ios: 'iOS',
    android: 'Android',
    react: 'Web',
    server: '',
  },
  services: {
    home: { platforms: ['ios', 'android', 'react'] },
    server: { platforms: ['server'] },
  },
};

// CSV 파싱 — module,key,en,ko 형식
function parseCsv(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').filter(line => line.trim());

  if (lines.length === 0) {
    console.error('CSV file is empty');
    process.exit(1);
  }

  // 헤더 파싱
  const header = parseCSVLine(lines[0]);
  const langColumns = header.slice(2); // ['en', 'ko', ...]

  const modules = {};   // { module: { lang: { key: value } } }
  const comments = {};  // { module: [{ type, key?, langs? }] } — 순서 보존용

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < 2) continue;

    const mod = cols[0];
    const key = cols[1];

    if (!modules[mod]) {
      modules[mod] = {};
      comments[mod] = [];
      for (const lang of langColumns) {
        modules[mod][lang] = {};
      }
    }

    // 주석 행: key가 #으로 시작
    if (key.startsWith('#')) {
      const commentText = key.slice(1).trim();
      comments[mod].push({ type: 'comment', value: commentText });
      continue;
    }

    // 일반 키-값 행
    const langs = {};
    for (let j = 0; j < langColumns.length; j++) {
      const lang = langColumns[j];
      const value = cols[j + 2] || '';
      modules[mod][lang][key] = value;
      langs[lang] = value;
    }
    comments[mod].push({ type: 'entry', key, langs });
  }

  return { modules, languages: langColumns, comments };
}

// CSV 라인 파싱 (따옴표 처리)
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        result.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
  }
  result.push(current);
  return result;
}

// iOS xcstrings 생성
function generateiOS(modules, languages) {
  const iosDir = path.join(CONFIG.outputDir, 'ios');
  fs.mkdirSync(iosDir, { recursive: true });

  for (const [mod, translations] of Object.entries(modules)) {
    const keys = Object.keys(translations[languages[0]] || {});

    const xcstrings = {
      sourceLanguage: CONFIG.sourceLanguage,
      strings: {},
      version: '1.0',
    };

    for (const key of keys) {
      xcstrings.strings[key] = {
        extractionState: 'manual',
        localizations: {},
      };

      for (const lang of languages) {
        if (translations[lang]?.[key]) {
          xcstrings.strings[key].localizations[lang] = {
            stringUnit: {
              state: 'translated',
              value: replacePlatform(translations[lang][key], 'ios'),
            },
          };
        }
      }
    }

    const fileName = toPascalCase(mod) + '.xcstrings';
    const jsonStr = JSON.stringify(xcstrings, null, 2).replace(/": /g, '" : ');
    fs.writeFileSync(path.join(iosDir, fileName), jsonStr);
    console.log(`  iOS: ${fileName}`);
  }
}

// Android strings.xml 생성
function generateAndroid(modules, languages, comments) {
  for (const lang of languages) {
    const dirName = lang === CONFIG.sourceLanguage ? 'values' : `values-${lang}`;
    const androidDir = path.join(CONFIG.outputDir, 'android', dirName);
    fs.mkdirSync(androidDir, { recursive: true });

    for (const [mod, ordered] of Object.entries(comments)) {
      if (!modules[mod]?.[lang]) continue;

      let xml = '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n';

      for (const item of ordered) {
        if (item.type === 'comment') {
          xml += `\n    <!-- ${item.value} -->\n`;
        } else if (item.type === 'entry') {
          const value = item.langs[lang];
          if (value) {
            const escapedValue = escapeXml(replacePlatform(value, 'android'));
            xml += `    <string name="${item.key}">${escapedValue}</string>\n`;
          }
        }
      }

      xml += '</resources>\n';

      const fileName = `strings_${mod}.xml`;
      fs.writeFileSync(path.join(androidDir, fileName), xml);
      console.log(`  Android (${lang}): ${fileName}`);
    }
  }
}

// React JSON 생성
function generateReact(modules, languages) {
  for (const lang of languages) {
    const reactDir = path.join(CONFIG.outputDir, 'react', lang);
    fs.mkdirSync(reactDir, { recursive: true });

    for (const [mod, translations] of Object.entries(modules)) {
      if (!translations[lang]) continue;

      const replaced = {};
      for (const [k, v] of Object.entries(translations[lang])) {
        replaced[k] = replacePlatform(v, 'react');
      }

      const fileName = `${mod}.json`;
      fs.writeFileSync(
        path.join(reactDir, fileName),
        JSON.stringify(replaced, null, 2) + '\n'
      );
      console.log(`  React (${lang}): ${fileName}`);
    }
  }
}

// Server JSON 생성 — {{platform}} 치환 없이 원본 그대로 출력
function generateServer(modules, languages) {
  for (const lang of languages) {
    const serverDir = path.join(CONFIG.outputDir, 'server', lang);
    fs.mkdirSync(serverDir, { recursive: true });

    for (const [mod, translations] of Object.entries(modules)) {
      if (!translations[lang]) continue;

      // {{platform}} 변수를 제거 (서버에서는 플랫폼 구분 불필요)
      const cleaned = {};
      for (const [k, v] of Object.entries(translations[lang])) {
        cleaned[k] = v.replace(/\s*\{\{platform\}\}/g, '').trim();
      }

      const fileName = `${mod}.json`;
      fs.writeFileSync(
        path.join(serverDir, fileName),
        JSON.stringify(cleaned, null, 2) + '\n'
      );
      console.log(`  Server (${lang}): ${fileName}`);
    }
  }
}

// 유틸리티
function toPascalCase(str) {
  return str.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

function replacePlatform(str, platform) {
  return str.replace(/\{\{platform\}\}/g, CONFIG.platformNames[platform]);
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, "\\'");
}

function cleanPlatformDirs(platforms) {
  fs.mkdirSync(CONFIG.outputDir, { recursive: true });

  for (const platform of platforms) {
    const dir = path.join(CONFIG.outputDir, platform);
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true });
    }
  }
  console.log(`Cleaned translations/{${platforms.join(', ')}}\n`);
}

// 메인 실행
function main() {
  const service = process.argv[2];
  const available = Object.keys(CONFIG.services);

  if (!service || !CONFIG.services[service]) {
    console.error(`Usage: node generate-i18n.js <service>`);
    console.error(`Available services: ${available.join(', ')}`);
    process.exit(1);
  }

  const config = CONFIG.services[service];
  const csvPath = path.join(CONFIG.rootDir, `${service}.csv`);

  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found: ${service}.csv`);
    process.exit(1);
  }

  console.log(`Generating [${service}] from ${service}.csv...\n`);
  cleanPlatformDirs(config.platforms);

  const { modules, languages, comments } = parseCsv(csvPath);
  const moduleNames = Object.keys(modules);
  console.log(`Modules: ${moduleNames.join(', ')}`);
  console.log(`Languages: ${languages.join(', ')}\n`);

  const generators = {
    ios: (m, l, c) => generateiOS(m, l),
    android: (m, l, c) => generateAndroid(m, l, c),
    react: (m, l, c) => generateReact(m, l),
    server: (m, l, c) => generateServer(m, l),
  };

  for (const platform of config.platforms) {
    generators[platform](modules, languages, comments);
  }

  console.log('\nDone!');
}

main();
