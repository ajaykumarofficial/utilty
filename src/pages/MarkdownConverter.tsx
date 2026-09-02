import { toast } from "react-hot-toast";
import { useState, useRef, useEffect } from 'react';
import { Copy, Check, Download, FileText, Trash2, Code } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useSEO } from '../hooks/useSEO';

export default function MarkdownConverter() {
  useSEO('Markdown to HTML Converter — Live Preview | ToolBox', 'Convert Markdown to HTML with a live preview pane and easy export options.');

  const [input, setInput] = useState('# Hello Markdown\n\nWrite your **markdown** here!\n\n- It is fast\n- It is secure\n- It works offline');
  const [html, setHtml] = useState('');
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'html'>('preview');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      const rawHtml = marked(input, { breaks: true, gfm: true }) as string;
      const cleanHtml = DOMPurify.sanitize(rawHtml);
      setHtml(cleanHtml);
    } catch (e) {
      console.error(e);
      setHtml('<p class="text-red-500">Error parsing markdown.</p>');
    }
  }, [input]);

  const clearInput = () => {
    setInput('');
    inputRef.current?.focus();
  };

  const handleCopy = () => {
    if (!html) return;
    navigator.clipboard.writeText(html)
    toast.success('Copied to clipboard');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    if (!html) return;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `export-${Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Markdown to HTML Converter</h1>
        <p className="text-gray-500">Live preview, sanitize, and export your Markdown to HTML.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Editor */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-[600px]">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 rounded-t-xl">
            <h2 className="font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Markdown
            </h2>
            <button
              onClick={clearInput}
              className="p-2 text-gray-500 hover:text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
              title="Clear"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your markdown here..."
            className="flex-1 w-full p-4 bg-transparent outline-none resize-none font-mono text-sm leading-relaxed"
            spellCheck="false"
          />
        </div>

        {/* Output */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-[600px]">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 rounded-t-xl">
            <div className="flex gap-1 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  viewMode === 'preview' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => setViewMode('html')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  viewMode === 'html' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Code className="w-4 h-4" />
                HTML
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="p-2 text-gray-500 hover:text-primary transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
                title="Copy HTML"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={handleExport}
                className="p-2 text-gray-500 hover:text-primary transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
                title="Download HTML file"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-gray-900 rounded-b-xl">
            {viewMode === 'preview' ? (
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <pre className="font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-300 whitespace-pre-wrap">
                {html}
              </pre>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
