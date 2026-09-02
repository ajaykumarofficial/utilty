import { useState, useEffect, useMemo } from 'react';
import { ArrowRightLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

interface RatesData {
  base: string;
  rates: Record<string, number>;
  lastUpdated: string;
}

const COMMON_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'NZD', 'MXN', 'SGD', 'HKD', 'NOK', 'KRW', 'TRY', 'RUB', 'BRL', 'ZAR'];

export default function CurrencyConverter() {
  useSEO('Currency Converter — Free & Fast | ToolBox', 'Convert between major world currencies instantly without signups.');

  const [ratesData, setRatesData] = useState<RatesData | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');

  useEffect(() => {
    fetch('/currency-rates.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch rates');
        return res.json();
      })
      .then((data: RatesData) => {
        setRatesData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Could not load currency rates. Please try again later.');
        setLoading(false);
      });
  }, []);

  const currencies = useMemo(() => {
    if (!ratesData) return COMMON_CURRENCIES;
    const all = Object.keys(ratesData.rates);
    // Prioritize common ones, then sort the rest
    const common = COMMON_CURRENCIES.filter(c => all.includes(c));
    const others = all.filter(c => !COMMON_CURRENCIES.includes(c)).sort();
    return [...common, ...others];
  }, [ratesData]);

  const convertedAmount = useMemo(() => {
    if (!ratesData || isNaN(parseFloat(amount))) return '';
    const val = parseFloat(amount);
    const rateFrom = ratesData.rates[fromCurrency];
    const rateTo = ratesData.rates[toCurrency];

    if (!rateFrom || !rateTo) return '';

    // Convert to base, then to target
    const inBase = val / rateFrom;
    const result = inBase * rateTo;

    return result.toFixed(2);
  }, [amount, fromCurrency, toCurrency, ratesData]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3">
        <AlertCircle className="w-6 h-6 shrink-0" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Currency Converter</h1>
        <p className="text-gray-500">Convert between major world currencies instantly.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-500">Amount</label>
            <div className="flex flex-col gap-2">
              <input
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 text-lg rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-primary font-medium"
              >
                {currencies.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleSwap}
            className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors mx-auto mt-6 md:mt-0 group"
            title="Swap currencies"
          >
            <ArrowRightLeft className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors" />
          </button>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-500">Converted Amount</label>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                readOnly
                value={convertedAmount}
                className="w-full px-4 py-3 text-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-bold outline-none"
              />
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-primary font-medium"
              >
                {currencies.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {ratesData && (
          <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-sm text-gray-500">
            <p>1 {fromCurrency} = {(ratesData.rates[toCurrency] / ratesData.rates[fromCurrency]).toFixed(4)} {toCurrency}</p>
            <p>Rates updated: {formatDate(ratesData.lastUpdated)}</p>
          </div>
        )}

      </div>
    </div>
  );
}
