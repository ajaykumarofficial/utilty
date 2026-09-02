import { toast } from "react-hot-toast";
import { useState, useMemo } from 'react';
import { FileText, Type, Hash, Clock, Trash2, Copy, Check } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function WordCounter() {
  useSEO('Free Word & Character Counter | ToolBox', 'Instant word count, character count, and reading time estimate tool.');

  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s+/g, '').length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const sentences = text.trim() === '' ? 0 : (text.match(/[.!?]+(?=\s|$)/g) || []).length || (words > 0 ? 1 : 0);
    const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).length;

    // Average reading speed is ~225 words per minute
    const readingTimeMins = words / 225;
    const readingTime = readingTimeMins < 1
      ? `${Math.ceil(readingTimeMins * 60)} sec`
      : `${Math.round(readingTimeMins)} min`;

    return {
      chars,
      charsNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime
    };
  }, [text]);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearText = () => {
    setText('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Word & Character Counter</h1>
        <p className="text-gray-500">Instant word count, character count, and reading time estimate.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          <Type className="w-5 h-5 mx-auto text-primary mb-2" />
          <div className="text-2xl font-bold">{stats.words}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Words</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          <Hash className="w-5 h-5 mx-auto text-primary mb-2" />
          <div className="text-2xl font-bold">{stats.chars}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Chars</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          <Hash className="w-5 h-5 mx-auto text-primary mb-2 opacity-70" />
          <div className="text-2xl font-bold">{stats.charsNoSpaces}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Chars (No Space)</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          <FileText className="w-5 h-5 mx-auto text-primary mb-2" />
          <div className="text-2xl font-bold">{stats.sentences}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Sentences</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          <FileText className="w-5 h-5 mx-auto text-primary mb-2 opacity-70" />
          <div className="text-2xl font-bold">{stats.paragraphs}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Paragraphs</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          <Clock className="w-5 h-5 mx-auto text-primary mb-2" />
          <div className="text-2xl font-bold">{stats.readingTime}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Reading Time</div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-[500px]">
        <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 rounded-t-xl">
          <div className="text-sm font-medium text-gray-500 ml-2">Type or paste your text below</div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              disabled={!text}
              className="p-2 text-gray-500 hover:text-primary disabled:opacity-50 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
              title="Copy text"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={clearText}
              disabled={!text}
              className="p-2 text-gray-500 hover:text-red-500 disabled:opacity-50 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
              title="Clear"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing..."
          className="flex-1 w-full p-4 bg-transparent outline-none resize-none text-base leading-relaxed"
          autoFocus
        />
      </div>
    </div>
  );
}
