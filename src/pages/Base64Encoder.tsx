import { toast } from "react-hot-toast";
import { useState, useRef } from 'react';
import { ArrowRightLeft, Copy, Check, Upload, Download, Trash2, Binary } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function Base64Encoder() {
  useSEO('Base64 Encoder & Decoder | ToolBox', 'Encode and decode text or files to Base64 format locally.');

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const [fileName, setFileName] = useState('');
  const [fileData, setFileData] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processText = (text: string, currentMode: 'encode' | 'decode') => {
    try {
      setError('');
      if (!text) {
        setOutput('');
        return;
      }

      if (currentMode === 'encode') {
        // Encode text safely handling utf-8
        setOutput(btoa(unescape(encodeURIComponent(text))));
      } else {
        // Decode text
        setOutput(decodeURIComponent(escape(atob(text))));
      }
    } catch {
      setError(`Invalid input for ${currentMode === 'encode' ? 'encoding' : 'decoding'}`);
      setOutput('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);
    setFileName('');
    setFileData('');
    processText(val, mode);
  };

  const toggleMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);

    // Swap input and output if dealing with text
    if (!fileData) {
      const currentOutput = output;
      setInput(currentOutput);
      processText(currentOutput, newMode);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output)
    toast.success('Copied to clipboard');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError('');

    const reader = new FileReader();
    if (mode === 'encode') {
      reader.onload = (event) => {
        const result = event.target?.result as string;
        // Data URL format: data:[<mediatype>][;base64],<data>
        // We just want the base64 part
        const base64 = result.split(',')[1];
        setFileData(result); // Store full data url for decoding later if needed
        setInput(''); // Clear text input
        setOutput(base64);
      };
      reader.readAsDataURL(file);
    } else {
      // Decode file from base64 text file
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setInput(text);
        processText(text, 'decode');
      };
      reader.readAsText(file);
    }
  };

  const handleDownload = () => {
    if (!output) return;

    if (mode === 'encode') {
      // Download as text file
      const blob = new Blob([output], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName ? `${fileName}.b64` : 'encoded.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // Decoding. If it was an encoded file, try to download as original file
      // If we don't know the mime type, default to application/octet-stream
      try {
        const byteCharacters = atob(output);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/octet-stream' });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        // Try to strip .b64 or .txt if present, otherwise default to decoded.bin
        let outName = fileName || 'decoded.bin';
        if (outName.endsWith('.b64')) outName = outName.slice(0, -4);
        else if (outName.endsWith('.txt')) outName = outName.slice(0, -4);

        link.download = outName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch {
        setError('Failed to download decoded file. Data might be corrupted.');
      }
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setFileName('');
    setFileData('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Base64 Encoder & Decoder</h1>
        <p className="text-gray-500">Encode and decode text or files to Base64 format locally.</p>
      </div>

      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex">
          <button
            onClick={() => { setMode('encode'); processText(input, 'encode'); }}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              mode === 'encode' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => { setMode('decode'); processText(input, 'decode'); }}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              mode === 'decode' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Decode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-stretch h-[400px]">

        {/* Input */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
          <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 rounded-t-xl">
            <span className="font-semibold text-sm flex items-center gap-2">
              <Binary className="w-4 h-4 text-primary" />
              {mode === 'encode' ? 'Plain Text / File' : 'Base64 Text / File'}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 text-gray-500 hover:text-primary transition-colors bg-gray-200 dark:bg-gray-700 rounded-md text-xs flex items-center gap-1 font-medium"
                title="Upload file"
              >
                <Upload className="w-3.5 h-3.5" />
                File
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={clearAll}
                className="p-1.5 text-gray-500 hover:text-red-500 transition-colors bg-gray-200 dark:bg-gray-700 rounded-md"
                title="Clear"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex-1 relative p-4 bg-transparent flex flex-col">
            {fileName && mode === 'encode' ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                <Upload className="w-12 h-12 mb-2 opacity-50" />
                <p>File loaded: <strong>{fileName}</strong></p>
                <p className="text-sm mt-1">Encoded to Base64.</p>
              </div>
            ) : (
              <textarea
                value={input}
                onChange={handleInputChange}
                placeholder={mode === 'encode' ? 'Type or paste plain text here...' : 'Type or paste Base64 string here...'}
                className="flex-1 w-full h-full bg-transparent outline-none resize-none font-mono text-sm leading-relaxed"
                spellCheck="false"
              />
            )}
          </div>
        </div>

        <button
          onClick={toggleMode}
          className="self-center p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors mx-auto shrink-0 group"
          title="Swap mode"
        >
          <ArrowRightLeft className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors" />
        </button>

        {/* Output */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
          <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 rounded-t-xl">
            <span className="font-semibold text-sm">
              {mode === 'encode' ? 'Base64 Result' : 'Decoded Result'}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                disabled={!output || !!error}
                className="p-1.5 text-gray-500 hover:text-primary disabled:opacity-50 transition-colors bg-gray-200 dark:bg-gray-700 rounded-md"
                title="Copy result"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleDownload}
                disabled={!output || !!error}
                className="p-1.5 text-gray-500 hover:text-primary disabled:opacity-50 transition-colors bg-gray-200 dark:bg-gray-700 rounded-md"
                title="Download file"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex-1 relative p-4 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl overflow-auto">
            {error ? (
              <div className="text-red-500 font-medium text-sm">{error}</div>
            ) : (
              <pre className="font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-300 whitespace-pre-wrap break-all">
                {output}
              </pre>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
