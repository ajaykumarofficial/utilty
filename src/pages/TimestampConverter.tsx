import { useState, useEffect } from 'react';
import { Clock, Copy, Check } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function TimestampConverter() {
  useSEO('Unix Timestamp & Date Converter | ToolBox', 'Convert between Unix timestamps and human-readable dates.');

  const [timestamp, setTimestamp] = useState<string>('');
  const [dateInput, setDateInput] = useState<string>('');
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize with current time
  useEffect(() => {
    const initTimestamp = Math.floor(Date.now() / 1000).toString();
    setTimestamp(initTimestamp);
    updateDateFromTimestamp(initTimestamp);
  }, []);

  const updateDateFromTimestamp = (ts: string) => {
    const parsed = parseInt(ts);
    if (!isNaN(parsed)) {
      // Assuming seconds, convert to ms
      const date = new Date(parsed * 1000);
      // Format to YYYY-MM-DDThh:mm for input type="datetime-local"
      const tzOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
      const localISOTime = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 16);
      setDateInput(localISOTime);
    } else {
      setDateInput('');
    }
  };

  const handleTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTimestamp(val);
    updateDateFromTimestamp(val);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDateInput(val);
    if (val) {
      const date = new Date(val);
      setTimestamp(Math.floor(date.getTime() / 1000).toString());
    } else {
      setTimestamp('');
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Helper to format date outputs safely
  const getFormattedDates = () => {
    const parsed = parseInt(timestamp);
    if (isNaN(parsed)) return null;
    const d = new Date(parsed * 1000);
    return {
      utc: d.toUTCString(),
      local: d.toString(),
      iso: d.toISOString(),
      relative: getRelativeTime(parsed)
    };
  };

  const getRelativeTime = (ts: number) => {
    const diff = now - ts;
    const absDiff = Math.abs(diff);

    if (absDiff < 60) return `${absDiff} seconds ${diff > 0 ? 'ago' : 'from now'}`;
    if (absDiff < 3600) return `${Math.floor(absDiff / 60)} minutes ${diff > 0 ? 'ago' : 'from now'}`;
    if (absDiff < 86400) return `${Math.floor(absDiff / 3600)} hours ${diff > 0 ? 'ago' : 'from now'}`;
    if (absDiff < 2592000) return `${Math.floor(absDiff / 86400)} days ${diff > 0 ? 'ago' : 'from now'}`;
    if (absDiff < 31536000) return `${Math.floor(absDiff / 2592000)} months ${diff > 0 ? 'ago' : 'from now'}`;
    return `${Math.floor(absDiff / 31536000)} years ${diff > 0 ? 'ago' : 'from now'}`;
  };

  const dates = getFormattedDates();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Timestamp & Date Converter</h1>
        <p className="text-gray-500">Convert between Unix timestamps and human-readable dates.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-8">

        {/* Current Time Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-primary/10 text-primary rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 font-medium">
            <Clock className="w-5 h-5" />
            Current Unix Timestamp:
          </div>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span className="text-2xl font-bold font-mono">{now}</span>
            <button
              onClick={() => handleCopy(now.toString(), 'now')}
              className="text-primary hover:text-blue-700 transition-colors"
            >
              {copiedField === 'now' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Unix Timestamp (Seconds)
            </label>
            <input
              type="number"
              value={timestamp}
              onChange={handleTimestampChange}
              placeholder="e.g. 1709251200"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none font-mono text-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Human Readable Date (Local)
            </label>
            <input
              type="datetime-local"
              value={dateInput}
              onChange={handleDateChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none font-mono text-lg"
            />
          </div>
        </div>

        {/* Results */}
        {dates && (
          <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4">Converted Formats</h2>

            <div className="grid gap-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm text-gray-500 w-24">GMT / UTC</div>
                <div className="font-mono text-sm sm:text-base flex-1 text-right sm:text-left mx-4">{dates.utc}</div>
                <button onClick={() => handleCopy(dates.utc, 'utc')} className="text-gray-400 hover:text-primary">
                  {copiedField === 'utc' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm text-gray-500 w-24">Your Local</div>
                <div className="font-mono text-sm sm:text-base flex-1 text-right sm:text-left mx-4">{dates.local}</div>
                <button onClick={() => handleCopy(dates.local, 'local')} className="text-gray-400 hover:text-primary">
                  {copiedField === 'local' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm text-gray-500 w-24">ISO 8601</div>
                <div className="font-mono text-sm sm:text-base flex-1 text-right sm:text-left mx-4">{dates.iso}</div>
                <button onClick={() => handleCopy(dates.iso, 'iso')} className="text-gray-400 hover:text-primary">
                  {copiedField === 'iso' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm text-gray-500 w-24">Relative</div>
                <div className="font-mono text-sm sm:text-base flex-1 text-right sm:text-left mx-4 capitalize">{dates.relative}</div>
                <button onClick={() => handleCopy(dates.relative, 'relative')} className="text-gray-400 hover:text-primary">
                  {copiedField === 'relative' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
