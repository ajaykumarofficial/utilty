import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';

const QrCodeGenerator = lazy(() => import('./pages/QrCodeGenerator'));
const PasswordGenerator = lazy(() => import('./pages/PasswordGenerator'));
const UnitConverter = lazy(() => import('./pages/UnitConverter'));
const CurrencyConverter = lazy(() => import('./pages/CurrencyConverter'));
const JsonFormatter = lazy(() => import('./pages/JsonFormatter'));
const MarkdownConverter = lazy(() => import('./pages/MarkdownConverter'));
const WordCounter = lazy(() => import('./pages/WordCounter'));
const ColorPicker = lazy(() => import('./pages/ColorPicker'));
const Base64Encoder = lazy(() => import('./pages/Base64Encoder'));
const ImageCompressor = lazy(() => import('./pages/ImageCompressor'));
const LoremIpsumGenerator = lazy(() => import('./pages/LoremIpsumGenerator'));
const TimestampConverter = lazy(() => import('./pages/TimestampConverter'));

const LoadingFallback = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="tools/qrcode" element={<QrCodeGenerator />} />
            <Route path="tools/password" element={<PasswordGenerator />} />
            <Route path="tools/unit" element={<UnitConverter />} />
            <Route path="tools/currency" element={<CurrencyConverter />} />
            <Route path="tools/json" element={<JsonFormatter />} />
            <Route path="tools/markdown" element={<MarkdownConverter />} />
            <Route path="tools/wordcount" element={<WordCounter />} />
            <Route path="tools/color" element={<ColorPicker />} />
            <Route path="tools/base64" element={<Base64Encoder />} />
            <Route path="tools/image" element={<ImageCompressor />} />
            <Route path="tools/lorem" element={<LoremIpsumGenerator />} />
            <Route path="tools/timestamp" element={<TimestampConverter />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
