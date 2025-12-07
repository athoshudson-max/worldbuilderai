import React from 'react';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  value, 
  onChange, 
  placeholder,
  rows = 3
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-bold text-gray-700 mb-1 font-serif">
        {label}
      </label>
      <textarea
        className="w-full p-2 border border-parchment-dark rounded focus:ring-2 focus:ring-accent focus:border-transparent bg-white text-ink placeholder-gray-400 text-sm leading-relaxed shadow-inner"
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};