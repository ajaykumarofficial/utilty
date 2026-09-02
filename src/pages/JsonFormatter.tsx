import { toast } from "react-hot-toast";
import { useState, useRef } from 'react';
import { Copy, Check, FileJson, Trash2, AlignLeft, Shrink } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function JsonFormatter() {
  useSEO('Free JSON Formatter & Validator | ToolBox', 'Format, minify, and validate JSON data instantly in your browser.');

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const formatJson = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError('');
        return;
      }
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
    }
  };

  const minifyJson = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError('');
        return;
      }
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
    }
  };

  const clearInput = () => {
    setInput('');
    setOutput('');
    setError('');
    inputRef.current?.focus();
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output)
    toast.success('Copied to clipboard');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold">JSON Formatter & Validator</h1>
        <p className="text-gray-500">Format, minify, and validate JSON data instantly in your browser.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Input */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-[600px]">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 rounded-t-xl">
            <h2 className="font-semibold flex items-center gap-2">
              <FileJson className="w-5 h-5 text-primary" />
              Input JSON
            </h2>
            <div className="flex gap-2">
              <button
                onClick={clearInput}
                className="p-2 text-gray-500 hover:text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                title="Clear"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="flex-1 w-full p-4 bg-transparent outline-none resize-none font-mono text-sm leading-relaxed"
            spellCheck="false"
          />
        </div>

        {/* Output */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-[600px]">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 rounded-t-xl">
            <div className="flex gap-2">
              <button
                onClick={formatJson}
                className="px-3 py-1.5 bg-primary text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium flex items-center gap-1.5"
              >
                <AlignLeft className="w-4 h-4" />
                Format
              </button>
              <button
                onClick={minifyJson}
                className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium flex items-center gap-1.5"
              >
                <Shrink className="w-4 h-4" />
                Minify
              </button>
            </div>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="p-2 text-gray-500 hover:text-primary disabled:opacity-50 disabled:hover:text-gray-500 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
              title="Copy Result"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex-1 relative overflow-auto bg-gray-50 dark:bg-gray-900 rounded-b-xl">
            {error ? (
              <div className="absolute inset-0 p-4 text-red-500 font-mono text-sm whitespace-pre-wrap">
                Error: {error}
              </div>
            ) : (
              <pre className="p-4 font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-300">
                {output}
              </pre>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
