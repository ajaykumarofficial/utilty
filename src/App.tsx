import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { Toaster } from 'react-hot-toast';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
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
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <>
      <Toaster position="bottom-right" toastOptions={{
        className: 'dark:bg-gray-800 dark:text-white',
      }} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={
            <Suspense fallback={<LoadingFallback />}>
              <Home />
            </Suspense>
          } />
          <Route path="tools/qr-code-generator" element={
            <Suspense fallback={<LoadingFallback />}>
              <QrCodeGenerator />
            </Suspense>
          } />
          <Route path="tools/password-generator" element={
            <Suspense fallback={<LoadingFallback />}>
              <PasswordGenerator />
            </Suspense>
          } />
          <Route path="tools/unit-converter" element={
            <Suspense fallback={<LoadingFallback />}>
              <UnitConverter />
            </Suspense>
          } />
          <Route path="tools/currency-converter" element={
            <Suspense fallback={<LoadingFallback />}>
              <CurrencyConverter />
            </Suspense>
          } />
          <Route path="tools/json-formatter" element={
            <Suspense fallback={<LoadingFallback />}>
              <JsonFormatter />
            </Suspense>
          } />
          <Route path="tools/markdown-converter" element={
            <Suspense fallback={<LoadingFallback />}>
              <MarkdownConverter />
            </Suspense>
          } />
          <Route path="tools/word-counter" element={
            <Suspense fallback={<LoadingFallback />}>
              <WordCounter />
            </Suspense>
          } />
          <Route path="tools/color-picker" element={
            <Suspense fallback={<LoadingFallback />}>
              <ColorPicker />
            </Suspense>
          } />
          <Route path="tools/base64-encoder" element={
            <Suspense fallback={<LoadingFallback />}>
              <Base64Encoder />
            </Suspense>
          } />
          <Route path="tools/image-compressor" element={
            <Suspense fallback={<LoadingFallback />}>
              <ImageCompressor />
            </Suspense>
          } />
          <Route path="tools/lorem-ipsum-generator" element={
            <Suspense fallback={<LoadingFallback />}>
              <LoremIpsumGenerator />
            </Suspense>
          } />
          <Route path="tools/timestamp-converter" element={
            <Suspense fallback={<LoadingFallback />}>
              <TimestampConverter />
            </Suspense>
          } />
          <Route path="*" element={
            <div className="text-center py-20">
              <h1 className="text-4xl font-bold mb-4">404</h1>
              <p className="text-gray-500">Tool not found.</p>
            </div>
          } />
        </Route>
      </Routes>
    </>
  );
}

export default App;
