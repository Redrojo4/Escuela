import React from 'react';

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  // Fix: Changed type from JSX.Element to React.ReactNode to resolve "Cannot find namespace 'JSX'" error.
  icon: React.ReactNode;
}

export const Tab: React.FC<TabProps> = ({ label, isActive, onClick, icon }) => {
  const baseClasses = "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500";
  const activeClasses = "bg-sky-600 text-white";
  const inactiveClasses = "bg-slate-700 text-slate-300 hover:bg-slate-600";

  return (
    <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      {icon}
      <span>{label}</span>
    </button>
  );
};