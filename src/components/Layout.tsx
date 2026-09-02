import { Outlet, Link, useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { TOOLS } from '../data/tools';

export default function Layout() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  // Determine if we're on a tool page
  const currentTool = useMemo(() => {
    return TOOLS.find(t => t.path === location.pathname);
  }, [location.pathname]);

  // Get related tools (same category, excluding current)
  const relatedTools = useMemo(() => {
    if (!currentTool) return [];
    let related = TOOLS.filter(t => t.category === currentTool.category && t.id !== currentTool.id);

    // If not enough related tools in category, grab some random ones
    if (related.length < 3) {
      const others = TOOLS.filter(t => t.category !== currentTool.category && t.id !== currentTool.id)
                          .sort(() => 0.5 - Math.random());
      related = [...related, ...others].slice(0, 3);
    }

    return related.slice(0, 3);
  }, [currentTool]);

  useEffect(() => {
    const savedMode = localStorage.getItem('theme');
    if (savedMode === 'dark' || (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-primary dark:text-blue-400">
              ToolBox
            </Link>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />

        {/* Related Tools Section */}
        {currentTool && relatedTools.length > 0 && (
          <div className="mt-20 pt-10 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">You might also like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.id}
                    to={tool.path}
                    className="flex items-start p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-primary/50 dark:hover:border-primary/50 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-primary flex items-center justify-center mr-4 shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{tool.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{tool.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} ToolBox. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
