import { useState, useMemo } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

const CATEGORIES = {
  Length: {
    Meter: 1,
    Kilometer: 1000,
    Centimeter: 0.01,
    Millimeter: 0.001,
    Mile: 1609.34,
    Yard: 0.9144,
    Foot: 0.3048,
    Inch: 0.0254,
  },
  Weight: {
    Kilogram: 1,
    Gram: 0.001,
    Milligram: 0.000001,
    MetricTon: 1000,
    Pound: 0.453592,
    Ounce: 0.0283495,
  },
  Volume: {
    Liter: 1,
    Milliliter: 0.001,
    CubicMeter: 1000,
    GallonUS: 3.78541,
    QuartUS: 0.946353,
    PintUS: 0.473176,
    CupUS: 0.24,
    FluidOunceUS: 0.0295735,
  },
  Temperature: {
    Celsius: 'C',
    Fahrenheit: 'F',
    Kelvin: 'K',
  },
  Speed: {
    MetersPerSecond: 1,
    KilometersPerHour: 0.277778,
    MilesPerHour: 0.44704,
    Knots: 0.514444,
  }
};

type Category = keyof typeof CATEGORIES;

export default function UnitConverter() {
  useSEO('Free Unit Converter — Instant Results | ToolBox', 'Convert length, weight, temperature, volume, and speed instantly in your browser.');

  const [category, setCategory] = useState<Category>('Length');
  const [fromUnit, setFromUnit] = useState<string>(Object.keys(CATEGORIES['Length'])[0]);
  const [toUnit, setToUnit] = useState<string>(Object.keys(CATEGORIES['Length'])[1]);
  const [fromValue, setFromValue] = useState<string>('1');

  const units = Object.keys(CATEGORIES[category]);

  const handleCategoryChange = (newCat: Category) => {
    setCategory(newCat);
    setFromUnit(Object.keys(CATEGORIES[newCat])[0]);
    setToUnit(Object.keys(CATEGORIES[newCat])[1]);
    setFromValue('1');
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const toValue = useMemo(() => {
    const val = parseFloat(fromValue);
    if (isNaN(val)) return '';

    if (category === 'Temperature') {
      let c = 0;
      // Convert to Celsius first
      if (fromUnit === 'Celsius') c = val;
      else if (fromUnit === 'Fahrenheit') c = (val - 32) * 5/9;
      else if (fromUnit === 'Kelvin') c = val - 273.15;

      // Convert from Celsius
      if (toUnit === 'Celsius') return c.toFixed(4);
      if (toUnit === 'Fahrenheit') return ((c * 9/5) + 32).toFixed(4);
      if (toUnit === 'Kelvin') return (c + 273.15).toFixed(4);
    } else {
      const catRates = CATEGORIES[category] as Record<string, number>;
      const baseValue = val * catRates[fromUnit];
      const result = baseValue / catRates[toUnit];
      // Format nicely
      if (Math.abs(result) < 0.0001 || Math.abs(result) > 10000) {
        return result.toExponential(4);
      }
      return Number(result.toFixed(6)).toString();
    }
    return '';
  }, [category, fromUnit, toUnit, fromValue]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Unit Converter</h1>
        <p className="text-gray-500">Convert length, weight, temperature, volume, and speed.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
          {(Object.keys(CATEGORIES) as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Converter */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-500">From</label>
            <div className="flex flex-col gap-2">
              <input
                type="number"
                value={fromValue}
                onChange={(e) => setFromValue(e.target.value)}
                className="w-full px-4 py-3 text-lg rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-primary"
              >
                {units.map((u) => (
                  <option key={u} value={u}>{u.replace(/([A-Z])/g, ' $1').trim()}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleSwap}
            className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors mx-auto mt-6 md:mt-0"
            title="Swap units"
          >
            <ArrowRightLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-500">To</label>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                readOnly
                value={toValue}
                className="w-full px-4 py-3 text-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold outline-none"
              />
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-primary"
              >
                {units.map((u) => (
                  <option key={u} value={u}>{u.replace(/([A-Z])/g, ' $1').trim()}</option>
                ))}
              </select>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
