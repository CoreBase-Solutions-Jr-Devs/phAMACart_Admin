import { useState, useEffect } from "react";

interface PriceSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export const PriceSlider = ({
  min,
  max,
  step = 10,
  value,
  onChange,
}: PriceSliderProps) => {
  const [minValue, setMinValue] = useState(value[0]);
  const [maxValue, setMaxValue] = useState(value[1]);

  useEffect(() => {
    setMinValue(value[0]);
    setMaxValue(value[1]);
  }, [value]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), maxValue);
    setMinValue(val);
    onChange([val, maxValue]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), minValue);
    setMaxValue(val);
    onChange([minValue, val]);
  };

  return (
    <div className="w-full space-y-2">
      <label className="block font-medium">Price Range</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={minValue}
          min={min}
          max={maxValue}
          onChange={handleMinChange}
          className="w-20 p-1 border rounded"
        />
        <span>-</span>
        <input
          type="number"
          value={maxValue}
          min={minValue}
          max={max}
          onChange={handleMaxChange}
          className="w-20 p-1 border rounded"
        />
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minValue}
        onChange={handleMinChange}
        className="w-full accent-primary"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxValue}
        onChange={handleMaxChange}
        className="w-full accent-primary"
      />

      <div className="flex justify-between text-sm">
        <span>KES {minValue}</span>
        <span>KES {maxValue}</span>
      </div>
    </div>
  );
};