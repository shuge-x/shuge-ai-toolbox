import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getTools } from '../../tool-registry/catalog';

const stagePriority = { active: 0, beta: 1, planned: 2 };

function ToolCard({ tool }: { tool: ReturnType<typeof getTools>[number] }) {
  return (
    <Link
      to={`/tools/${tool.id}`}
      className={`block p-5 rounded-xl border transition-all ${
        tool.stage === 'planned' ? 'opacity-60' : 'hover:shadow-md'
      }`}
      style={{
        backgroundColor: 'var(--color-neutral-50)',
        borderColor: 'var(--color-neutral-200)',
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium" style={{ color: 'var(--color-neutral-900)' }}>
          {tool.name}
        </h3>
        {tool.stage === 'planned' && (
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{
              backgroundColor: 'var(--color-neutral-200)',
              color: 'var(--color-neutral-600)',
            }}
          >
            Planned
          </span>
        )}
        {tool.stage === 'beta' && (
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{
              backgroundColor: 'var(--color-accent-100)',
              color: 'var(--color-accent-600)',
            }}
          >
            Beta
          </span>
        )}
      </div>
      <p className="text-sm" style={{ color: 'var(--color-neutral-500)' }}>
        {tool.description}
      </p>
    </Link>
  );
}

export default function Home() {
  const tools = getTools();
  const categories = [...new Set(tools.map((t) => t.category))].sort();
  const [activeTab, setActiveTab] = useState<string>('全部');

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredTools =
    activeTab === '全部' ? tools : tools.filter((t) => t.category === activeTab);

  return (
    <div className="space-y-12 px-6 py-8">
      <div className="text-center py-12">
        <h1
          className="text-3xl font-bold mb-3"
          style={{ color: 'var(--color-neutral-900)' }}
        >
          shuge AI Toolbox
        </h1>
        <p style={{ color: 'var(--color-neutral-500)' }}>
          探索 AI 工具，提升工作效率
        </p>
      </div>

      <nav className="flex gap-2 border-b border-neutral-200">
        <button
          onClick={() => handleTabClick('全部')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === '全部'
              ? 'border-b-2 border-accent-500 text-accent-600'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          全部
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleTabClick(cat)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === cat
                ? 'border-b-2 border-accent-500 text-accent-600'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </nav>

      {activeTab === '全部' ? (
        categories.map((category) => {
          const categoryTools = filteredTools
            .filter((t) => t.category === category)
            .sort((a, b) => {
              const priorityDiff = stagePriority[a.stage] - stagePriority[b.stage];
              if (priorityDiff !== 0) return priorityDiff;
              return a.name.localeCompare(b.name);
            });
          return (
            <section key={category}>
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: 'var(--color-neutral-800)' }}
              >
                {category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          );
        })
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools
            .sort((a, b) => {
              const priorityDiff = stagePriority[a.stage] - stagePriority[b.stage];
              if (priorityDiff !== 0) return priorityDiff;
              return a.name.localeCompare(b.name);
            })
            .map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
        </div>
      )}
    </div>
  );
}