import React from 'react';

interface AccordionSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const AccordionSection: React.FC<AccordionSectionProps> = ({ 
  title, 
  isOpen, 
  onToggle, 
  children,
  icon
}) => {
  return (
    <div className="border border-parchment-dark rounded-md mb-4 overflow-hidden shadow-sm bg-white">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-4 transition-colors duration-200 ${
          isOpen ? 'bg-parchment text-ink font-bold' : 'bg-paper text-gray-700 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-accent text-xl">{icon}</span>}
          <span className="font-serif text-lg">{title}</span>
        </div>
        <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      
      {isOpen && (
        <div className="p-6 bg-paper border-t border-parchment-dark animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
};