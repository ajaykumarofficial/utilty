import { useState, useMemo } from 'react';
import { Copy, Check, Palette } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

// Helper to convert hex to RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Helper to convert RGB to HSL
const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

// Helper to convert HSL to Hex
const hslToHex = (h: number, s: number, l: number) => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
};

export default function ColorPicker() {
  useSEO('Color Picker & Palette Generator | ToolBox', 'Pick colors, convert formats, and generate analogous or complementary color palettes.');

  const [color, setColor] = useState('#3B82F6');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const colorData = useMemo(() => {
    const rgb = hexToRgb(color);
    if (!rgb) return null;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    // Generate Palette (Analogous, Complementary, Triadic)
    const palettes = {
      complementary: [
        hslToHex(hsl.h, hsl.s, hsl.l),
        hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l)
      ],
      analogous: [
        hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
        hslToHex(hsl.h, hsl.s, hsl.l),
        hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l)
      ],
      triadic: [
        hslToHex(hsl.h, hsl.s, hsl.l),
        hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l)
      ]
    };

    return { rgb, hsl, palettes };
  }, [color]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!colorData) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Color Picker & Palette Generator</h1>
        <p className="text-gray-500">Pick a color, get codes, and generate beautiful palettes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Picker and Codes */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32 rounded-2xl shadow-inner border border-gray-200 dark:border-gray-700 overflow-hidden shrink-0">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value.toUpperCase())}
                  className="absolute -top-4 -left-4 w-40 h-40 cursor-pointer"
                />
              </div>
              <div className="flex-1 space-y-2">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  Select Color
                </h2>
                <p className="text-sm text-gray-500">Click the square to open the color picker.</p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="font-mono text-sm">HEX</div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-medium">{color}</span>
                  <button onClick={() => handleCopy(color, 'hex')} className="text-gray-500 hover:text-primary transition-colors">
                    {copiedIndex === 'hex' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="font-mono text-sm">RGB</div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-medium">rgb({colorData.rgb.r}, {colorData.rgb.g}, {colorData.rgb.b})</span>
                  <button onClick={() => handleCopy(`rgb(${colorData.rgb.r}, ${colorData.rgb.g}, ${colorData.rgb.b})`, 'rgb')} className="text-gray-500 hover:text-primary transition-colors">
                    {copiedIndex === 'rgb' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="font-mono text-sm">HSL</div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-medium">hsl({colorData.hsl.h}, {colorData.hsl.s}%, {colorData.hsl.l}%)</span>
                  <button onClick={() => handleCopy(`hsl(${colorData.hsl.h}, ${colorData.hsl.s}%, ${colorData.hsl.l}%)`, 'hsl')} className="text-gray-500 hover:text-primary transition-colors">
                    {copiedIndex === 'hsl' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Palettes */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
            <h2 className="text-xl font-bold">Color Palettes</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Complementary</h3>
                <div className="flex h-16 rounded-lg overflow-hidden shadow-sm">
                  {colorData.palettes.complementary.map((c, i) => (
                    <div
                      key={i}
                      className="flex-1 group relative cursor-pointer"
                      style={{ backgroundColor: c }}
                      onClick={() => handleCopy(c, `comp-${i}`)}
                    >
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          {copiedIndex === `comp-${i}` ? 'Copied!' : c}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Analogous</h3>
                <div className="flex h-16 rounded-lg overflow-hidden shadow-sm">
                  {colorData.palettes.analogous.map((c, i) => (
                    <div
                      key={i}
                      className="flex-1 group relative cursor-pointer"
                      style={{ backgroundColor: c }}
                      onClick={() => handleCopy(c, `ana-${i}`)}
                    >
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          {copiedIndex === `ana-${i}` ? 'Copied!' : c}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Triadic</h3>
                <div className="flex h-16 rounded-lg overflow-hidden shadow-sm">
                  {colorData.palettes.triadic.map((c, i) => (
                    <div
                      key={i}
                      className="flex-1 group relative cursor-pointer"
                      style={{ backgroundColor: c }}
                      onClick={() => handleCopy(c, `tri-${i}`)}
                    >
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          {copiedIndex === `tri-${i}` ? 'Copied!' : c}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
