## 1. 项目脚手架初始化

- [ ] 1.1 使用 Vite 初始化 React + TypeScript 项目
  命令：`npx create-vite@latest . --template react-ts --yes`
  预期：项目文件生成，package.json 包含 react, react-dom, typescript, vite 依赖

- [ ] 1.2 安装依赖
  命令：`npm install`
  预期：node_modules/ 生成

- [ ] 1.3 安装 Tailwind CSS
  命令：`npm install -D tailwindcss @tailwindcss/vite`
  预期：package.json devDependencies 包含 tailwindcss

- [ ] 1.4 配置 Tailwind CSS（vite.config.ts）
  修改 `vite.config.ts`：
  ```typescript
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'
  import tailwindcss from '@tailwindcss/vite'

  export default defineConfig({
    plugins: [react(), tailwindcss()],
  })
  ```

- [ ] 1.5 配置 Tailwind CSS（index.css）
  修改 `src/index.css`：
  ```css
  @import "tailwindcss";
  ```

- [ ] 1.6 安装 React Router
  命令：`npm install react-router-dom`
  预期：package.json dependencies 包含 react-router-dom

- [ ] 1.7 安装 ESLint + Prettier
  命令：`npm install -D eslint prettier eslint-plugin-react-hooks`
  预期：devDependencies 更新

- [ ] 1.8 验证项目能运行
  命令：`npm run dev -- --host 127.0.0.1 --port 5173`
  预期：浏览器能打开 http://127.0.0.1:5173，显示 Vite 默认页面

---

## 2. 目录结构创建

- [ ] 2.1 创建 app/layouts 目录
  命令：`mkdir -p src/app/layouts`

- [ ] 2.2 创建 app/views 目录
  命令：`mkdir -p src/app/views`

- [ ] 2.3 创建 modules 目录（.gitkeep 占位）
  命令：`mkdir -p src/modules && touch src/modules/.gitkeep`

- [ ] 2.4 创建 router 目录
  命令：`mkdir -p src/router`

- [ ] 2.5 创建 lib 目录（.gitkeep 占位）
  命令：`mkdir -p src/lib && touch src/lib/.gitkeep`

- [ ] 2.6 创建 tool-registry 目录
  命令：`mkdir -p src/tool-registry`

---

## 3. 工具注册中心接口

- [ ] 3.1 创建 tool-registry/catalog.ts 接口定义

  新建 `src/tool-registry/catalog.ts`：
  ```typescript
  export interface ToolManifest {
    id: string;
    name: string;
    route: string;
    category: string;
    description: string;
  }

  const tools: ToolManifest[] = [];

  export function getTools(): ToolManifest[] {
    return tools;
  }

  export function getToolById(id: string): ToolManifest | undefined {
    return tools.find((tool) => tool.id === id);
  }

  export function getToolsByCategory(category: string): ToolManifest[] {
    return tools.filter((tool) => tool.category === category);
  }
  ```

- [ ] 3.2 提交 catalog 接口
  ```bash
  git add src/tool-registry/catalog.ts
  git commit -m "feat: add ToolManifest interface and query functions"
  ```

---

## 4. 路由配置

- [ ] 4.1 创建 router/index.ts

  新建 `src/router/index.ts`：
  ```typescript
  import { createBrowserRouter, RouterProvider } from 'react-router-dom';
  import Home from '../app/views/Home';
  import NotFound from '../app/views/NotFound';

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);

  export default function RouterProvider() {
    return <RouterProvider router={router} />;
  }
  ```

- [ ] 4.2 更新 main.tsx 使用路由
  修改 `src/main.tsx`：
  ```typescript
  import { StrictMode } from 'react'
  import { createRoot } from 'react-dom/client'
  import './index.css'
  import Router from './router'

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Router />
    </StrictMode>,
  )
  ```

- [ ] 4.3 提交路由配置
  ```bash
  git add src/router/index.ts src/main.tsx
  git commit -m "feat: add React Router with Home and NotFound routes"
  ```

---

## 5. 页面组件

- [ ] 5.1 创建 Home.tsx 占位页面

  新建 `src/app/views/Home.tsx`：
  ```tsx
  import { getTools } from '../../tool-registry/catalog';

  export default function Home() {
    const tools = getTools();

    return (
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-4">shuge AI Toolbox</h1>
        <p className="text-gray-600 mb-8">
          AI 工具集合平台
        </p>
        <section>
          <h2 className="text-xl font-semibold mb-4">工具列表</h2>
          {tools.length === 0 ? (
            <p className="text-gray-400">暂无工具</p>
          ) : (
            <ul className="space-y-2">
              {tools.map((tool) => (
                <li key={tool.id} className="border rounded p-4">
                  <span className="font-medium">{tool.name}</span>
                  <span className="text-gray-500 ml-2">- {tool.description}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    );
  }
  ```

- [ ] 5.2 创建 NotFound.tsx

  新建 `src/app/views/NotFound.tsx`：
  ```tsx
  import { Link } from 'react-router-dom';

  export default function NotFound() {
    return (
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-4">404</h1>
        <p className="text-gray-600 mb-4">页面未找到</p>
        <Link to="/" className="text-blue-500 hover:underline">
          返回首页
        </Link>
      </main>
    );
  }
  ```

- [ ] 5.3 清理默认 Vite 文件
  命令：`rm -f src/App.tsx src/App.css src/assets/react.svg`

- [ ] 5.4 验证路由工作
  命令：在浏览器访问 http://127.0.0.1:5173/ 应显示 "shuge AI Toolbox" 和 "暂无工具"
  访问 http://127.0.0.1:5173/nonexistent 应显示 404 页面

- [ ] 5.5 提交页面组件
  ```bash
  git add src/app/views/Home.tsx src/app/views/NotFound.tsx
  git rm src/App.tsx src/App.css 2>/dev/null || true
  git commit -m "feat: add Home and NotFound page components"
  ```

---

## 6. OpenSpec 工作流配置

- [ ] 6.1 创建 OpenSpec 配置文件
  命令：`npx openspec init`（如果未初始化）
  或手动创建 `openspec/config.yaml`

- [ ] 6.2 配置 schema fork
  命令：`npx openspec fork --source anthropic/openspec --target shuge/openspec-schema`
  预期：forked schema 在 shuge/openspec-schema 仓库

- [ ] 6.3 提交 OpenSpec 配置
  ```bash
  git add openspec/
  git commit -m "docs: add OpenSpec workflow configuration"
  ```

---

## 7. Git 初始化和 GitHub 推送

- [ ] 7.1 初始化 Git 仓库（如果还未初始化）
  命令：`git init`

- [ ] 7.2 创建 .gitignore
  新建 `.gitignore`：
  ```
  node_modules/
  dist/
  .DS_Store
  *.local
  ```

- [ ] 7.3 初始提交
  ```bash
  git add .
  git commit -m "chore: initial project scaffold"
  ```

- [ ] 7.4 添加 GitHub remote 并推送
  ```bash
  git remote add origin git@github.com:shuge/shuge-ai-toolbox.git
  git branch -M main
  git push -u origin main
  ```
  预期：仓库出现在 https://github.com/shuge/shuge-ai-toolbox

---

## 8. 验证

- [ ] 8.1 运行构建验证
  命令：`npm run build`
  预期：`dist/` 目录生成，包含 index.html 和静态资源

- [ ] 8.2 最终 GitHub 推送
  ```bash
  git push
  ```