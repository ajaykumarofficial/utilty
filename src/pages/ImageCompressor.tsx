import { toast } from "react-hot-toast";
import { useState, useRef, useEffect } from 'react';
import { Download, Upload, Image as ImageIcon, Settings2, Trash2 } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function ImageCompressor() {
  useSEO('Free Image Compressor & Resizer | ToolBox', 'Compress and resize images directly in your browser. No uploads, total privacy.');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [compressedUrl, setCompressedUrl] = useState<string>('');
  const [quality, setQuality] = useState(0.8);
  const [maxWidth, setMaxWidth] = useState<string>('');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setImageFile(file);
    setOriginalSize(file.size);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setMaxWidth(''); // reset max width when new image loaded
  };

  useEffect(() => {
    if (previewUrl && canvasRef.current) {
      const img = new Image();
      img.src = previewUrl;
      img.onload = () => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;

        let width = img.width;
        let height = img.height;

        const targetMaxWidth = parseInt(maxWidth);
        if (!isNaN(targetMaxWidth) && targetMaxWidth > 0 && width > targetMaxWidth) {
          const ratio = targetMaxWidth / width;
          width = targetMaxWidth;
          height = height * ratio;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = imageFile?.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const outputQuality = mimeType === 'image/jpeg' ? quality : undefined;

        const dataUrl = canvas.toDataURL(mimeType, outputQuality);
        setCompressedUrl(dataUrl);

        const sizeInBytes = Math.round((dataUrl.length - 22) * 3 / 4);
        setCompressedSize(sizeInBytes);
      };
    }
  }, [previewUrl, quality, maxWidth, imageFile?.type]);

  const handleDownload = () => {
    if (!compressedUrl) return;
    const link = document.createElement('a');
    link.href = compressedUrl;
    const extension = imageFile?.type === 'image/png' ? 'png' : 'jpg';
    link.download = `compressed-${Date.now()}.${extension}`;
    document.body.appendChild(link);
    toast.success('Downloaded compressed image!');
    link.click();
    document.body.removeChild(link);
  };

  const clearAll = () => {
    setImageFile(null);
    setPreviewUrl('');
    setCompressedUrl('');
    setOriginalSize(0);
    setCompressedSize(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const savingsPercent = originalSize > 0 && compressedSize > 0
    ? Math.round((1 - (compressedSize / originalSize)) * 100)
    : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Image Compressor & Resizer</h1>
        <p className="text-gray-500">Compress and resize images directly in your browser. No uploads, total privacy.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">

        {/* Settings Sidebar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-6 h-fit">
          <div className="flex items-center gap-2 font-semibold border-b border-gray-100 dark:border-gray-700 pb-4">
            <Settings2 className="w-5 h-5 text-primary" />
            Settings
          </div>

          <div className="space-y-4">
            <div>
              <label className="flex justify-between text-sm font-medium mb-2">
                <span>Quality (JPEG only)</span>
                <span>{Math.round(quality * 100)}%</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                disabled={!imageFile || imageFile.type === 'image/png'}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Max Width (px)</label>
              <input
                type="number"
                value={maxWidth}
                onChange={(e) => setMaxWidth(e.target.value)}
                placeholder="e.g. 1920"
                disabled={!imageFile}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:opacity-50"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty to keep original width.</p>
            </div>
          </div>

          {compressedUrl && (
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Original:</span>
                <span className="font-medium">{formatSize(originalSize)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Compressed:</span>
                <span className="font-medium text-green-600 dark:text-green-400">{formatSize(compressedSize)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Savings:</span>
                <span className="font-medium">{savingsPercent > 0 ? `${savingsPercent}%` : '0%'}</span>
              </div>

              <button
                onClick={handleDownload}
                className="w-full py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          )}
        </div>

        {/* Main Area */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
            <h2 className="font-semibold flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              Preview
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={clearAll}
                disabled={!imageFile}
                className="p-1.5 text-gray-500 hover:text-red-500 disabled:opacity-50 transition-colors bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                title="Clear"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 flex items-center justify-center bg-gray-50 dark:bg-gray-900 overflow-hidden relative">
            {!previewUrl ? (
              <div className="text-center text-gray-500">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>Click "Upload" to select an image.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-full">
                <div className="flex flex-col h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                  <div className="bg-gray-100 dark:bg-gray-700 p-2 text-center text-xs font-medium text-gray-600 dark:text-gray-300">Original</div>
                  <div className="flex-1 p-2 flex items-center justify-center overflow-auto">
                    <img src={previewUrl} alt="Original" className="max-w-full max-h-full object-contain" />
                  </div>
                </div>
                <div className="flex flex-col h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                  <div className="bg-gray-100 dark:bg-gray-700 p-2 text-center text-xs font-medium text-gray-600 dark:text-gray-300">Compressed</div>
                  <div className="flex-1 p-2 flex items-center justify-center overflow-auto relative">
                     {compressedUrl && <img src={compressedUrl} alt="Compressed" className="max-w-full max-h-full object-contain" />}
                  </div>
                </div>
              </div>
            )}

            {/* Hidden canvas for processing */}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>

      </div>
    </div>
  );
}
