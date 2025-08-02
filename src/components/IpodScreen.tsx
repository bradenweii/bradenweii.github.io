import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IpodMenuBar } from './IpodMenuBar';

interface IpodScreenProps {
  menuMode: boolean;
  menuLevel: 'main' | 'submenu' | 'projects' | 'music' | 'music-artists' | 'music-artist-songs' | 'now-playing';
  currentTab: string;
  selectedMenuItem: number;
  getCurrentSelectedItem: () => { label: string; id: string; githubUrl?: string } | null;
  getCurrentMenuItems: () => Array<{ label: string; id: string; githubUrl?: string }>;
  handleMenuItemSelect: (index: number) => void;
  handleSubMenuItemSelect: (index: number) => void;
  handleProjectSelect: (index: number) => void;
  handleMusicMenuSelect: (index: number) => void;
  handleArtistSelect: (index: number) => void;
  handleArtistSongSelect: (index: number) => void;
}

export function IpodScreen({
  menuMode,
  menuLevel,
  currentTab,
  selectedMenuItem,
  getCurrentSelectedItem,
  getCurrentMenuItems,
  handleMenuItemSelect,
  handleSubMenuItemSelect,
  handleProjectSelect,
  handleMusicMenuSelect,
  handleArtistSelect,
  handleArtistSongSelect,
}: IpodScreenProps) {
  const lastClickRef = useRef(0);

  const handleClick = (index: number) => {
    const now = Date.now();
    if (now - lastClickRef.current < 200) return; // Prevent rapid clicks
    lastClickRef.current = now;

    if (menuLevel === 'projects') {
      handleProjectSelect(index);
    } else if (menuLevel === 'submenu') {
      handleSubMenuItemSelect(index);
    } else if (menuLevel === 'music') {
      handleMusicMenuSelect(index);
    } else if (menuLevel === 'music-artists') {
      handleArtistSelect(index);
    } else if (menuLevel === 'music-artist-songs') {
      handleArtistSongSelect(index);
    } else {
      handleMenuItemSelect(index);
    }
  };

  return (
    <div className="w-full h-[240px] bg-[#c5e0f5] rounded-lg border-2 border-gray-400 mb-6 overflow-hidden lcd-screen">
      <div className="h-full flex flex-col">
        <IpodMenuBar
          menuMode={menuMode}
          menuLevel={menuLevel}
          currentSelectedItem={getCurrentSelectedItem()}
        />
        
        <div className="flex-1 overflow-y-auto content-container">
          <AnimatePresence mode="wait">
            {menuMode ? (
              <motion.div
                key={menuLevel}
                initial={{ opacity: 0, x: menuLevel === 'projects' ? 20 : menuLevel === 'submenu' ? 0 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: menuLevel === 'projects' ? -20 : menuLevel === 'submenu' ? 0 : 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="h-full"
              >
                {getCurrentMenuItems().map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.2,
                      delay: index * 0.05,
                      ease: "easeOut"
                    }}
                    className={`menu-item ${
                      index === selectedMenuItem ? 'selected' : ''
                    }`}
                    onClick={() => handleClick(index)}
                  >
                    <span className="font-chicago">{item.label}</span>
                    <span className="arrow">›</span>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="h-full p-4"
              >
                <motion.div 
                  key={currentTab}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="text-[#0c5a79] font-chicago"
                >
                  {currentTab === 'home' && <div>Welcome to my website! Hope you like iPods as much as I do.</div>}
                  {currentTab === 'about' && <div className="text-sm">Hi I'm Braden, a CS & Stats student at McGill University with a passion for building startups. I'm currently interning at  <a className="underline" href="https://www.valsoftcorp.com" target="_blank" rel="noopener noreferrer">Valsoft Corp</a> as a AI Developer, where I'm building AI solutions for portfolio companies across diverse industries.</div>}
                  {currentTab === 'instagram' && (
                    <div className="text-sm">
                      <h3 className="font-bold mb-2">Instagram Business Order Automation</h3>
                      <p className="mb-2">This workflow automates order processing for Instagram business owners by scanning chats, identifying orders, generating receipts via ChatGPT, saving them to a csv(which the user can open in google sheets), and sending receipts to customers—streamlining order managements and improving efficiency.</p>
                      <button 
                        onClick={() => window.open('https://github.com/bradenweii/Instagram-business-order-automation', '_blank')}
                        className="text-[#0c5a79] hover:underline cursor-pointer"
                      >
                        View on GitHub
                      </button>
                    </div>
                  )}
                  {currentTab === 'roomiez' && (
                    <div className="text-sm">
                      <h3 className="font-bold mb-2">Roomiez</h3>
                      <p className="mb-2">A roommate matching app for college students!</p>
                      <button 
                        onClick={() => window.open('https://github.com/tektaxi/roomiez', '_blank')}
                        className="text-[#0c5a79] hover:underline cursor-pointer"
                      >
                        View on GitHub
                      </button>
                    </div>
                  )}
                  {currentTab === 'sign' && (
                    <div className="text-sm">
                      <h3 className="font-bold mb-2">Sign Recognition</h3>
                      <p className="mb-2">Sign language interpreter</p>
                      <button 
                        onClick={() => window.open('https://github.com', '_blank')}
                        className="text-[#0c5a79] hover:underline cursor-pointer"
                      >
                        View on GitHub
                      </button>
                    </div>
                  )}
                  {currentTab === 'blog' && <div>Blogs coming soon</div>}
                  {currentTab === 'resume' && (
                    <div className="flex flex-col gap-2">
                      <a 
                        href="/resume.pdf" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm hover:underline"
                      >
                        View Resume
                      </a>
                      <p className="text-xs text-gray-600">Click to open in a new tab</p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
