import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Type,
  RefreshCw,
  Code2,
  Feather,
  Beaker,
  ClipboardList,
  Wand2,
} from 'lucide-react';
import { getTools } from '../../tool-registry/catalog';

const stagePriority = { active: 0, beta: 1, planned: 2 };

const categoryIcons: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  '文本处理': Type,
  '数据转换': RefreshCw,
  '开发工具': Code2,
  '内容创作': Feather,
};

function ToolCard({ tool }: { tool: ReturnType<typeof getTools>[number] }) {
  return (
    <Link
      to={`/tools/${tool.id}`}
      className={`block p-5 rounded-xl border transition-all duration-200 hover:shadow-lg hover:scale-[1.02] animate-fadeInUp ${
        tool.stage === 'planned' ? 'opacity-60' : ''
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
            className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded"
            style={{
              backgroundColor: 'var(--color-neutral-200)',
              color: 'var(--color-neutral-600)',
            }}
          >
            <ClipboardList size={14} />
            Planned
          </span>
        )}
        {tool.stage === 'beta' && (
          <span
            className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded"
            style={{
              backgroundColor: 'var(--color-accent-100)',
              color: 'var(--color-accent-600)',
            }}
          >
            <Beaker size={14} />
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
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const updateIndicator = (index: number) => {
    const btn = tabRefs.current[index];
    if (btn) {
      setIndicator({
        left: btn.offsetLeft,
        width: btn.offsetWidth,
      });
    }
  };

  const handleTabClick = (tab: string, index: number) => {
    setActiveTab(tab);
    updateIndicator(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredTools =
    activeTab === '全部' ? tools : tools.filter((t) => t.category === activeTab);

  useEffect(() => {
    const cards = document.querySelectorAll('.animate-fadeInUp');
    cards.forEach((card, index) => {
      (card as HTMLElement).style.setProperty('--card-delay', `${index * 100}ms`);
    });
  }, [filteredTools]);

  useEffect(() => {
    const idx = tabRefs.current.findIndex((r) => r?.dataset.tab === activeTab);
    if (idx >= 0) updateIndicator(idx);

    const handleResize = () => {
      const i = tabRefs.current.findIndex((r) => r?.dataset.tab === activeTab);
      if (i >= 0) updateIndicator(i);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab]);

  const allTabs = ['全部', ...categories];

  return (
    <div className="space-y-12 px-6 py-8">
      <div
        className="text-center py-12 px-6 rounded-b-2xl"
        style={{
          background: 'linear-gradient(135deg, var(--color-neutral-50) 0%, var(--color-primary-50) 100%)',
          borderBottom: '1px solid var(--color-neutral-200)',
        }}
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <span style={{ color: 'var(--color-primary-500)' }}>
            <Wand2 size={32} strokeWidth={1.5} />
          </span>
          <h1
            className="text-3xl font-bold"
            style={{ color: 'var(--color-neutral-900)' }}
          >
            shuge AI Toolbox
          </h1>
        </div>
        <p style={{ color: 'var(--color-neutral-500)' }}>
          探索 AI 工具，提升工作效率
        </p>
      </div>

      <nav className="flex gap-2 border-b border-neutral-200 relative">
        <div
          className="absolute bottom-0 h-[2px] bg-[var(--color-primary-500)] rounded-full transition-all duration-250"
          style={{ left: indicator.left, width: indicator.width }}
        />
        {allTabs.map((tab, index) => (
          <button
            key={tab}
            ref={(el) => { tabRefs.current[index] = el; }}
            data-tab={tab}
            onClick={() => handleTabClick(tab, index)}
            className="px-4 py-2 text-sm font-medium transition-colors"
            style={{
              color: activeTab === tab ? 'var(--color-primary-600)' : 'var(--color-neutral-500)',
              borderColor: activeTab === tab ? 'var(--color-primary-500)' : 'transparent',
            }}
          >
            {tab}
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
                className="text-xl font-semibold mb-4 flex items-center gap-2"
                style={{ color: 'var(--color-neutral-800)' }}
              >
                {categoryIcons[category] && (
                  <span style={{ color: 'var(--color-primary-500)' }}>
                    {React.createElement(categoryIcons[category], { size: 20 })}
                  </span>
                )}
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