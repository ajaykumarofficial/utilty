import { toast } from "react-hot-toast";
import { useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import QRCode from 'qrcode';
import { useSEO } from '../hooks/useSEO';

export default function QrCodeGenerator() {
  useSEO('Free QR Code Generator — No Signup | ToolBox', 'Create downloadable QR codes from text or URLs instantly.');

  const [text, setText] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [error, setError] = useState('');

  const generateQR = async () => {
    if (!text.trim()) {
      setQrUrl('');
      return;
    }

    try {
      setError('');
      const url = await QRCode.toDataURL(text, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      setQrUrl(url);
    } catch (err) {
      console.error(err);
      setError('Failed to generate QR code');
    }
  };

  const handleDownload = () => {
    if (!qrUrl) return;
    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.png`;
    link.href = qrUrl;
    document.body.appendChild(link);
    toast.success('Downloaded successfully!');
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Free QR Code Generator</h1>
        <p className="text-gray-500">Create downloadable QR codes from text or URLs instantly.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
        <div>
          <label htmlFor="text" className="block text-sm font-medium mb-2">
            URL or Text
          </label>
          <div className="flex gap-2">
            <input
              id="text"
              type="text"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (e.target.value === '') setQrUrl('');
              }}
              onKeyUp={(e) => e.key === 'Enter' && generateQR()}
              placeholder="https://example.com or any text"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
            <button
              onClick={generateQR}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Generate
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {qrUrl && (
          <div className="flex flex-col items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
            <div className="p-4 bg-white rounded-xl shadow-sm inline-block">
              <img src={qrUrl} alt="Generated QR Code" className="w-[200px] h-[200px]" />
            </div>
            <button
              onClick={handleDownload}
              className="px-6 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download PNG
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
