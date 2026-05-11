import { getTools } from '../../tool-registry/catalog';

export default function Home() {
  const tools = getTools();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">shuge AI Toolbox</h1>
      <p className="text-gray-600 mb-8">AI 工具集合平台</p>
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