import { Link } from 'react-router-dom';
import { getTools } from '../../tool-registry/catalog';

const stagePriority = { active: 0, beta: 1, planned: 2 };

export default function Home() {
  const tools = getTools();

  const grouped = tools.reduce<Record<string, typeof tools>>((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {});

  const sortedCategories = Object.keys(grouped).sort();

  return (
    <div className="space-y-8">
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">shuge AI Toolbox</h1>
        <p className="text-gray-600">探索 AI 工具，提升工作效率</p>
      </div>

      {sortedCategories.map((category) => {
        const categoryTools = grouped[category].sort((a, b) => {
          const priorityDiff = stagePriority[a.stage] - stagePriority[b.stage];
          if (priorityDiff !== 0) return priorityDiff;
          return a.name.localeCompare(b.name);
        });

        return (
          <section key={category}>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryTools.map((tool) => (
                <Link
                  key={tool.id}
                  to={`/tools/${tool.id}`}
                  className={`block p-4 rounded-lg border transition-colors ${
                    tool.stage === 'planned'
                      ? 'bg-gray-50 border-gray-200 opacity-75'
                      : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{tool.name}</h3>
                    {tool.stage === 'planned' && (
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                        Planned
                      </span>
                    )}
                    {tool.stage === 'beta' && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                        Beta
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{tool.description}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}