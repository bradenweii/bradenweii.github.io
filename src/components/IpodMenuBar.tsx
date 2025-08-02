import React from 'react';

interface IpodMenuBarProps {
  menuMode: boolean;
  menuLevel: 'main' | 'submenu' | 'projects' | 'music' | 'music-artists' | 'music-artist-songs' | 'now-playing';
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
              : menuLevel === 'music'
                ? 'Music'
              : menuLevel === 'music-artists'
                ? 'Artists'
              : menuLevel === 'music-artist-songs'
                ? 'Songs'
                : 'Menu') 
          : currentSelectedItem?.label || 'Menu'}
      </div>
      <div className="h-[0.5px] bg-gray-500 opacity-50"></div>
    </>
  );
} 