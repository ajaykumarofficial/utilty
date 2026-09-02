import { QrCode, Key, Calculator, DollarSign, FileJson, FileText, Type, Palette, Binary, Image as ImageIcon, AlignLeft, Clock } from 'lucide-react';
import React from 'react';

export type Category = 'Generators' | 'Converters' | 'Developer' | 'Media & Text';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  path: string;
  category: Category;
}

export const TOOLS: Tool[] = [
  { id: 'qrcode', name: 'QR Code Generator', description: 'Create downloadable QR codes from text or URLs.', icon: QrCode, path: '/tools/qrcode', category: 'Generators' },
  { id: 'password', name: 'Password Generator', description: 'Generate strong, secure passwords instantly.', icon: Key, path: '/tools/password', category: 'Generators' },
  { id: 'lorem', name: 'Lorem Ipsum Generator', description: 'Generate placeholder text easily.', icon: AlignLeft, path: '/tools/lorem', category: 'Generators' },
  { id: 'unit', name: 'Unit Converter', description: 'Convert length, weight, temperature, and more.', icon: Calculator, path: '/tools/unit', category: 'Converters' },
  { id: 'currency', name: 'Currency Converter', description: 'Convert between major world currencies.', icon: DollarSign, path: '/tools/currency', category: 'Converters' },
  { id: 'timestamp', name: 'Timestamp Converter', description: 'Convert Unix timestamps to human-readable dates.', icon: Clock, path: '/tools/timestamp', category: 'Converters' },
  { id: 'json', name: 'JSON Formatter', description: 'Format and validate JSON data.', icon: FileJson, path: '/tools/json', category: 'Developer' },
  { id: 'base64', name: 'Base64 Encoder', description: 'Encode and decode text or files to Base64.', icon: Binary, path: '/tools/base64', category: 'Developer' },
  { id: 'markdown', name: 'Markdown Converter', description: 'Convert Markdown to HTML with live preview.', icon: FileText, path: '/tools/markdown', category: 'Developer' },
  { id: 'wordcount', name: 'Word Counter', description: 'Count words, characters, and estimate reading time.', icon: Type, path: '/tools/wordcount', category: 'Media & Text' },
  { id: 'color', name: 'Color Picker', description: 'Pick colors and generate palettes.', icon: Palette, path: '/tools/color', category: 'Media & Text' },
  { id: 'image', name: 'Image Compressor', description: 'Resize and compress images in your browser.', icon: ImageIcon, path: '/tools/image', category: 'Media & Text' },
];

export const CATEGORIES: { name: Category; description: string }[] = [
  { name: 'Generators', description: 'Create new content on the fly.' },
  { name: 'Converters', description: 'Transform values from one format to another.' },
  { name: 'Developer', description: 'Handy utilities for coding and formatting.' },
  { name: 'Media & Text', description: 'Tools for images, colors, and writing.' }
];
