import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Key, Calculator, DollarSign, FileJson, FileText, Type, Palette, Binary, Image as ImageIcon, AlignLeft, Clock } from 'lucide-react';

const TOOLS = [
  { id: 'qrcode', name: 'QR Code Generator', description: 'Create downloadable QR codes from text or URLs.', icon: QrCode, path: '/tools/qrcode' },
  { id: 'password', name: 'Password Generator', description: 'Generate strong, secure passwords instantly.', icon: Key, path: '/tools/password' },
  { id: 'unit', name: 'Unit Converter', description: 'Convert length, weight, temperature, and more.', icon: Calculator, path: '/tools/unit' },
  { id: 'currency', name: 'Currency Converter', description: 'Convert between major world currencies.', icon: DollarSign, path: '/tools/currency' },
  { id: 'json', name: 'JSON Formatter', description: 'Format and validate JSON data.', icon: FileJson, path: '/tools/json' },
  { id: 'markdown', name: 'Markdown Converter', description: 'Convert Markdown to HTML with live preview.', icon: FileText, path: '/tools/markdown' },
  { id: 'wordcount', name: 'Word Counter', description: 'Count words, characters, and estimate reading time.', icon: Type, path: '/tools/wordcount' },
  { id: 'color', name: 'Color Picker', description: 'Pick colors and generate palettes.', icon: Palette, path: '/tools/color' },
  { id: 'base64', name: 'Base64 Encoder', description: 'Encode and decode text or files to Base64.', icon: Binary, path: '/tools/base64' },
  { id: 'image', name: 'Image Compressor', description: 'Resize and compress images in your browser.', icon: ImageIcon, path: '/tools/image' },
  { id: 'lorem', name: 'Lorem Ipsum Generator', description: 'Generate placeholder text easily.', icon: AlignLeft, path: '/tools/lorem' },
  { id: 'timestamp', name: 'Timestamp Converter', description: 'Convert Unix timestamps to human-readable dates.', icon: Clock, path: '/tools/timestamp' },
];

export default function Home() {
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

      <div className="max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTools.map((tool) => {
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
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{tool.name}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm flex-grow">
                {tool.description}
              </p>
            </Link>
          );
        })}
        {filteredTools.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No tools found matching "{search}"
          </div>
        )}
      </div>
    </div>
  );
}
