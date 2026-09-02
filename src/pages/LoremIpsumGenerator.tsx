import { toast } from "react-hot-toast";
import { useState, useMemo } from 'react';
import { Copy, Check, RefreshCw, AlignLeft } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

const WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation",
  "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo", "consequat", "duis",
  "aute", "irure", "in", "reprehenderit", "voluptate", "velit", "esse", "cillum",
  "eu", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat",
  "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim",
  "id", "est", "laborum"
];

export default function LoremIpsumGenerator() {
  useSEO('Lorem Ipsum Generator | ToolBox', 'Generate placeholder text instantly for your designs or mockups.');

  const [count, setCount] = useState(3);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [htmlMode, setHtmlMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [seed, setSeed] = useState(0); // Used to force regeneration

  const generateWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

  const generateSentence = (wordCount: number = Math.floor(Math.random() * 10) + 5) => {
    let sentence = "";
    for (let i = 0; i < wordCount; i++) {
      let word = generateWord();
      if (i === 0) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      sentence += word + (i === wordCount - 1 ? "." : " ");
    }
    return sentence;
  };

  const generateParagraph = (sentenceCount: number = Math.floor(Math.random() * 5) + 3) => {
    let paragraph = "";
    for (let i = 0; i < sentenceCount; i++) {
      paragraph += generateSentence() + (i === sentenceCount - 1 ? "" : " ");
    }
    return paragraph;
  };

  const generatedText = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    seed; // trick to trigger re-memoization on seed change

    const result = [];
    const actualCount = Math.max(1, count);

    if (type === 'paragraphs') {
      for (let i = 0; i < actualCount; i++) {
        const p = generateParagraph();
        result.push(htmlMode ? `<p>${p}</p>` : p);
      }
      return result.join(htmlMode ? '\n' : '\n\n');
    }

    if (type === 'sentences') {
      for (let i = 0; i < actualCount; i++) {
        result.push(generateSentence());
      }
      return result.join(' ');
    }

    if (type === 'words') {
      let words = "";
      for (let i = 0; i < actualCount; i++) {
        words += generateWord() + (i === actualCount - 1 ? "" : " ");
      }
      return words;
    }

    return "";
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, type, htmlMode, seed]);

  const handleCopy = () => {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText)
    toast.success('Copied to clipboard');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const regenerate = () => {
    setSeed(s => s + 1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Lorem Ipsum Generator</h1>
        <p className="text-gray-500">Generate placeholder text instantly.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-20 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'paragraphs' | 'sentences' | 'words')}
              className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none cursor-pointer"
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer ml-auto">
            <input
              type="checkbox"
              checked={htmlMode}
              onChange={(e) => setHtmlMode(e.target.checked)}
              disabled={type !== 'paragraphs'}
              className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary disabled:opacity-50"
            />
            <span className={`text-sm ${type !== 'paragraphs' ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
              HTML &lt;p&gt; tags
            </span>
          </label>
        </div>

        {/* Output */}
        <div className="relative group">
          <div className="absolute right-2 top-2 flex gap-2">
            <button
              onClick={regenerate}
              className="p-2 text-gray-500 hover:text-primary transition-colors bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-md"
              title="Generate new text"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 text-gray-500 hover:text-primary transition-colors bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-md"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="w-full min-h-[300px] p-6 pr-16 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 text-lg leading-relaxed whitespace-pre-wrap flex items-start gap-3">
            <AlignLeft className="w-6 h-6 text-primary shrink-0 mt-1 opacity-50" />
            <div className="flex-1">
              {generatedText}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
