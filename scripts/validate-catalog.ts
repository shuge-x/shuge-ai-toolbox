#!/usr/bin/env tsx
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = join(__dirname, '..');

const catalogPath = join(rootDir, 'src/tool-registry/catalog.ts');
const catalogContent = readFileSync(catalogPath, 'utf-8');

const idMatches = [...catalogContent.matchAll(/id:\s*['"]([^'"]+)['"]/g)];
const stageMatches = [...catalogContent.matchAll(/stage:\s*['"](\w+)['"]/g)];

const ids = idMatches.map((m) => m[1]);
const stages = stageMatches.map((m) => m[1]);

const missing: string[] = [];

for (let i = 0; i < ids.length; i++) {
  const id = ids[i];
  const stage = stages[i];
  if (stage !== 'planned') {
    const componentPath = join(rootDir, 'src/modules', id, 'index.tsx');
    if (!existsSync(componentPath)) {
      missing.push(id);
    }
  }
}

if (missing.length > 0) {
  console.error('❌ 缺少以下工具的组件文件:');
  missing.forEach((id) => console.error(`  - src/modules/${id}/index.tsx`));
  process.exit(1);
} else {
  console.log('✅ 所有工具组件文件存在');
  process.exit(0);
}