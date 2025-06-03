import React from 'react';

interface IpodMenuBarProps {
  menuMode: boolean;
  menuLevel: 'main' | 'submenu' | 'projects';
  currentSelectedItem?: { label: string } | null;
}

export function IpodMenuBar({ menuMode, menuLevel, currentSelectedItem }: IpodMenuBarProps) {
  return (
    <>
      <div className="h-8 bg-[#0c5a79] text-white flex items-center justify-center font-bold font-chicago">
        {menuMode 
          ? (menuLevel === 'projects' 
              ? 'Projects' 
              : menuLevel === 'submenu' 
                ? 'Me' 
                : 'Menu') 
          : currentSelectedItem?.label || 'Menu'}
      </div>
      <div className="h-[0.5px] bg-gray-500 opacity-50"></div>
    </>
  );
} 