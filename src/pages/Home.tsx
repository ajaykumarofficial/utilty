import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { TOOLS, CATEGORIES } from '../data/tools';
import { useSEO } from '../hooks/useSEO';

export default function Home() {
  useSEO('ToolBox | Free Utility Tools for Developers & Creators', 'A hub of small, fast, client-side utility tools. No backend, no accounts, just instant results.');
  const [search, setSearch] = useState('');

  const filteredTools = TOOLS.filter((tool) =>
    tool.name.toLowerCase().includes(search.toLowerCase()) ||
    tool.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Utility Tools for Developers & Creators</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          A collection of small, fast, client-side utility tools. No backend, no accounts, just instant results.
        </p>
      </div>

      <div className="max-w-xl mx-auto relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search for a tool..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-0 focus:border-primary dark:focus:border-primary outline-none transition-all shadow-sm text-lg"
        />
      </div>

      {search.trim() ? (
        // Search Results View
        <div>
          <h2 className="text-xl font-semibold mb-6 text-gray-700 dark:text-gray-300">Search Results</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  to={tool.path}
                  className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-primary/50 dark:hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-primary flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{tool.name}</h3>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm flex-grow">
                    {tool.description}
                  </p>
                </Link>
              );
            })}
            {filteredTools.length === 0 && (
              <div className="col-span-full text-center py-16 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-lg">No tools found matching "{search}"</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Categorized View
        <div className="space-y-12 pt-4">
          {CATEGORIES.map((category) => {
            const categoryTools = TOOLS.filter(t => t.category === category.name);
            if (categoryTools.length === 0) return null;

            return (
              <section key={category.name}>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">{category.name}</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{category.description}</p>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {categoryTools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.id}
                        to={tool.path}
                        className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-primary/50 dark:hover:border-primary/50 transition-all group"
                      >
                        <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{tool.name}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm flex-grow">
                          {tool.description}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

    </div>
  );
}
