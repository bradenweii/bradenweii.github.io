import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// Tab types
type Tab = 'home' | 'me' | 'about' | 'projects' | 'instagram' | 'roomiez' | 'sign' | 'blog' | 'resume';
type MenuLevel = 'main' | 'submenu' | 'projects';
type WheelArea = 'top' | 'right' | 'bottom' | 'left' | 'center';
type RotationDirection = 'clockwise' | 'counterclockwise';

// How many degrees of wheel rotation should equal one scroll step
const rotationStepDeg = 8; // Reduced from 15 to make rotation more responsive

function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('home');
  const [menuMode, setMenuMode] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState(0);
  const [menuLevel, setMenuLevel] = useState<MenuLevel>('main');
  const [isWheelMode, setIsWheelMode] = useState(true);
  const [wheelDelta, setWheelDelta] = useState(0);

  // Refs for tracking continuous touch rotation
  const wheelRef = useRef<HTMLDivElement>(null);
  const lastAngleRef = useRef<number | null>(null);
  const rotationAccumulatorRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isTouchDraggingRef = useRef(false);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const recentTouchRef = useRef(false);
  const fromMenuLabelRef = useRef(false);
  const isInTouchDragRef = useRef(false);

  // Add refs to track previous selections
  const previousMainSelection = useRef(0);
  const previousSubSelection = useRef(0);
  const previousProjectSelection = useRef(0);

  const mainMenuItems = [
    { id: 'home', label: 'Home' },
    { id: 'me', label: 'Me' },
  ];

  const subMenuItems = [
    { id: 'about', label: 'About Me' },
    { id: 'projects', label: 'Projects' },
    { id: 'blog', label: 'Blog' },
    { id: 'resume', label: 'Resume' },
  ];

  const projectItems = [
    { id: 'instagram', label: 'Instagram Business Order Automation', githubUrl: 'https://github.com/bradenweii/Instagram-business-order-automation' },
    { id: 'roomiez', label: 'Roomiez', githubUrl: 'https://github.com/tektaxi/roomiez' },
    { id: 'sign', label: 'Sign Recognition', githubUrl: 'https://github.com' },
  ];

  const handleMenuItemSelect = (index: number) => {
    setSelectedMenuItem(index);
    const selectedItem = mainMenuItems[index];
    
    if (selectedItem.id === 'me') {
      previousMainSelection.current = index;
      setMenuLevel('submenu');
      setSelectedMenuItem(previousSubSelection.current); // Restore previous submenu selection
    } else {
      setMenuMode(false);
      setCurrentTab(selectedItem.id as Tab);
    }
  };

  const handleSubMenuItemSelect = (index: number) => {
    const selectedItem = subMenuItems[index];
    previousSubSelection.current = index;
    
    if (selectedItem.id === 'projects') {
      setMenuLevel('projects');
      setSelectedMenuItem(previousProjectSelection.current);
    } else {
      setMenuMode(false);
      setCurrentTab(selectedItem.id as Tab);
      // Ensure we're in the correct menu level when returning
      if (selectedItem.id === 'blog' || selectedItem.id === 'resume') {
        setMenuLevel('submenu');
      }
    }
  };

  const handleProjectSelect = (index: number) => {
    previousProjectSelection.current = index;
    const project = projectItems[index];
    window.open(project.githubUrl, '_blank');
  };

  const handleMenuButton = () => {
    if (!menuMode) {
      setMenuMode(true);
      if (currentTab === 'instagram' || currentTab === 'roomiez' || currentTab === 'sign') {
        setMenuLevel('projects');
        const safeIndex = Math.min(previousProjectSelection.current, projectItems.length - 1);
        setSelectedMenuItem(safeIndex);
      } else if (currentTab === 'about' || currentTab === 'blog' || currentTab === 'resume') {
        setMenuLevel('submenu');
        const index = subMenuItems.findIndex(item => item.id === currentTab);
        const safeIndex = index >= 0 ? index : Math.min(previousSubSelection.current, subMenuItems.length - 1);
        setSelectedMenuItem(safeIndex);
      } else {
        setMenuLevel('main');
        const safeIndex = Math.min(previousMainSelection.current, mainMenuItems.length - 1);
        setSelectedMenuItem(safeIndex);
      }
    } else {
      switch (menuLevel) {
        case 'projects':
          setMenuLevel('submenu');
          const safeSubIndex = Math.min(previousSubSelection.current, subMenuItems.length - 1);
          setSelectedMenuItem(safeSubIndex);
          break;
        case 'submenu':
          setMenuLevel('main');
          const safeMainIndex = Math.min(previousMainSelection.current, mainMenuItems.length - 1);
          setSelectedMenuItem(safeMainIndex);
          break;
        case 'main':
          break;
      }
    }
  };

  const handleWheelClick = (area: WheelArea) => {
    // Add haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50); // 50ms vibration
    }

    switch (area) {
      case 'top':
        handleMenuButton();
        break;
      case 'right':
        if (!menuMode) {
          const nextIndex = (selectedMenuItem + 1) % mainMenuItems.length;
          handleMenuItemSelect(nextIndex);
        }
        break;
      case 'bottom':
        if (!menuMode) {
          setIsWheelMode(!isWheelMode);
          if (isWheelMode) {
            const contentContainer = document.querySelector('.content-container');
            if (contentContainer) {
              contentContainer.scrollBy({ top: 50, behavior: 'smooth' });
            }
          }
        }
        break;
      case 'left':
        if (!menuMode) {
          const prevIndex = (selectedMenuItem - 1 + mainMenuItems.length) % mainMenuItems.length;
          handleMenuItemSelect(prevIndex);
        }
        break;
      case 'center':
        if (menuMode) {
          if (menuLevel === 'projects') {
            handleProjectSelect(selectedMenuItem);
          } else if (menuLevel === 'submenu') {
            handleSubMenuItemSelect(selectedMenuItem);
          } else {
            handleMenuItemSelect(selectedMenuItem);
          }
        }
        break;
    }
  };

  const handleWheelRotation = (direction: RotationDirection) => {
    if (menuMode) {
      const items = menuLevel === 'projects' ? projectItems : menuLevel === 'submenu' ? subMenuItems : mainMenuItems;
      if (!items || items.length === 0) return; // Guard against empty arrays
      
      const newIndex = direction === 'clockwise'
        ? (selectedMenuItem + 1) % items.length
        : (selectedMenuItem - 1 + items.length) % items.length;
      setSelectedMenuItem(newIndex);
    } else if (!menuMode && isWheelMode) {
      const contentContainer = document.querySelector('.content-container');
      if (contentContainer) {
        const scrollAmount = direction === 'clockwise' ? 50 : -50;
        contentContainer.scrollBy({ top: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const getAngleFromCenterDeg = (x: number, y: number): number => {
    if (!wheelRef.current) return 0;
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return (Math.atan2(y - centerY, x - centerX) * 180) / Math.PI;
  };

  const getAngleFromCenterRad = (x: number, y: number): number => {
    if (!wheelRef.current) return 0;
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(y - centerY, x - centerX);
  };

  const getWheelSection = (angleDeg: number): WheelArea => {
    const angle = (angleDeg * Math.PI) / 180;
    if (angle >= -Math.PI / 4 && angle < Math.PI / 4) {
      return 'right';
    } else if (angle >= Math.PI / 4 && angle < (3 * Math.PI) / 4) {
      return 'bottom';
    } else if (angle >= (3 * Math.PI) / 4 || angle < (-3 * Math.PI) / 4) {
      return 'left';
    } else {
      return 'top';
    }
  };

  const isTouchInCenter = (x: number, y: number): boolean => {
    if (!wheelRef.current) return false;
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    return distance <= 32;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (isTouchInCenter(touch.clientX, touch.clientY)) return;

    const angleRad = getAngleFromCenterRad(touch.clientX, touch.clientY);
    lastAngleRef.current = angleRad;
    rotationAccumulatorRef.current = 0;
    isTouchDraggingRef.current = false;
    touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (lastAngleRef.current === null) return;

    const touch = e.touches[0];
    const currentAngleRad = getAngleFromCenterRad(touch.clientX, touch.clientY);

    let delta = currentAngleRad - lastAngleRef.current;
    if (delta > Math.PI) delta -= 2 * Math.PI;
    if (delta < -Math.PI) delta += 2 * Math.PI;

    rotationAccumulatorRef.current += delta;
    lastAngleRef.current = currentAngleRad;

    const threshold = (rotationStepDeg * Math.PI) / 180;

    // Trigger rotation events when threshold exceeded
    while (rotationAccumulatorRef.current > threshold) {
      handleWheelRotation('clockwise');
      rotationAccumulatorRef.current -= threshold;
    }

    while (rotationAccumulatorRef.current < -threshold) {
      handleWheelRotation('counterclockwise');
      rotationAccumulatorRef.current += threshold;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isTouchDraggingRef.current && touchStartPosRef.current) {
      const angleDeg = getAngleFromCenterDeg(touchStartPosRef.current.x, touchStartPosRef.current.y);
      const section = getWheelSection(angleDeg);
      handleWheelClick(section);
      recentTouchRef.current = true;
      setTimeout(() => {
        recentTouchRef.current = false;
      }, 500);
    }

    lastAngleRef.current = null;
    rotationAccumulatorRef.current = 0;
    isTouchDraggingRef.current = false;
    touchStartPosRef.current = null;

    if (isInTouchDragRef.current) {
      setTimeout(() => {
        isInTouchDragRef.current = false;
      }, 100);
    }
  };

  const handleMouseWheel = (e: React.WheelEvent) => {
    const newDelta = wheelDelta + Math.abs(e.deltaY);
    setWheelDelta(newDelta);

    if (newDelta >= 30) { // Reduced from 50 to make wheel scrolling more responsive
      if (e.deltaY < 0) {
        handleWheelRotation('counterclockwise');
      } else {
        handleWheelRotation('clockwise');
      }
      setWheelDelta(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (recentTouchRef.current) return;

    fromMenuLabelRef.current = e.target && (e.target as HTMLElement).classList.contains('menu-button');
    e.preventDefault();

    const startAngleRad = getAngleFromCenterRad(e.clientX, e.clientY);
    lastAngleRef.current = startAngleRad;
    rotationAccumulatorRef.current = 0;
    isDraggingRef.current = false;

    const threshold = (rotationStepDeg * Math.PI) / 180;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (lastAngleRef.current === null) return;

      const currentAngleRad = getAngleFromCenterRad(moveEvent.clientX, moveEvent.clientY);
      let delta = currentAngleRad - lastAngleRef.current;
      if (delta > Math.PI) delta -= 2 * Math.PI;
      if (delta < -Math.PI) delta += 2 * Math.PI;

      rotationAccumulatorRef.current += delta;
      lastAngleRef.current = currentAngleRad;

      if (!isDraggingRef.current && Math.abs(rotationAccumulatorRef.current) > threshold) {
        isDraggingRef.current = true;
      }

      while (rotationAccumulatorRef.current > threshold) {
        handleWheelRotation('clockwise');
        rotationAccumulatorRef.current -= threshold;
      }

      while (rotationAccumulatorRef.current < -threshold) {
        handleWheelRotation('counterclockwise');
        rotationAccumulatorRef.current += threshold;
      }
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      if (!isDraggingRef.current && !fromMenuLabelRef.current) {
        const angleDeg = getAngleFromCenterDeg(upEvent.clientX, upEvent.clientY);
        const section = getWheelSection(angleDeg);
        handleWheelClick(section);
      }

      lastAngleRef.current = null;
      rotationAccumulatorRef.current = 0;
      isDraggingRef.current = false;
      fromMenuLabelRef.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (menuMode) {
        const items = menuLevel === 'projects' ? projectItems : menuLevel === 'submenu' ? subMenuItems : mainMenuItems;
        if (e.deltaY > 0) {
          // Scroll down
          const newIndex = (selectedMenuItem + 1) % items.length;
          setSelectedMenuItem(newIndex);
        } else {
          // Scroll up
          const newIndex = (selectedMenuItem - 1 + items.length) % items.length;
          setSelectedMenuItem(newIndex);
        }
      }
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [menuMode, menuLevel, selectedMenuItem]);

  // Add a function to get the current menu items
  const getCurrentMenuItems = () => {
    switch (menuLevel) {
      case 'projects':
        return projectItems;
      case 'submenu':
        return subMenuItems;
      case 'main':
        return mainMenuItems;
      default:
        return mainMenuItems;
    }
  };

  // Add a function to get the current selected item
  const getCurrentSelectedItem = () => {
    const items = getCurrentMenuItems();
    if (!items || items.length === 0) return null;
    const safeIndex = Math.min(selectedMenuItem, items.length - 1);
    return items[safeIndex];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 flex items-center justify-center p-4">
      <div className="w-[300px] h-[500px] bg-gradient-to-br from-[#d8d8d8] via-[#f0f0f0] to-[#c0c0c0] rounded-3xl shadow-[inset_0_2px_6px_rgba(255,255,255,0.6),_0_4px_8px_rgba(0,0,0,0.2)] border border-[#999] flex flex-col items-center p-4">
        {/* Screen */}
        <div className="w-full h-[240px] bg-[#c5e0f5] rounded-lg border-2 border-gray-400 mb-6 overflow-hidden lcd-screen">
          <div className="h-full flex flex-col">
            {/* Title bar */}
            <div className="h-8 bg-[#0c5a79] text-white flex items-center justify-center font-bold font-chicago">
              {menuMode ? (menuLevel === 'projects' ? 'Projects' : menuLevel === 'submenu' ? 'Me' : 'Menu') : getCurrentSelectedItem()?.label || 'Menu'}
            </div>
            <div className="h-[0.5px] bg-gray-500 opacity-50"></div>

            
            {/* Content area */}
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
                    {(menuLevel === 'main' ? mainMenuItems : 
                      menuLevel === 'submenu' ? subMenuItems : 
                      projectItems).map((item, index) => (
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
                        onClick={() => {
                          if (menuLevel === 'projects') {
                            handleProjectSelect(index);
                          } else if (menuLevel === 'submenu') {
                            handleSubMenuItemSelect(index);
                          } else {
                            handleMenuItemSelect(index);
                          }
                        }}
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
                    {/* Content for each tab will go here */}
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
                            onClick={() => window.open(projectItems[0].githubUrl, '_blank')}
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
                            onClick={() => window.open(projectItems[1].githubUrl, '_blank')}
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
                            onClick={() => window.open(projectItems[2].githubUrl, '_blank')}
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

        {/* Click Wheel */}
        <div 
          ref={wheelRef}
          className="w-[200px] h-[200px] rounded-full bg-gray-300 relative pixel-border mt-2 touch-none select-none"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleMouseWheel}
        >
          {/* Center button */}
          <button
            onClick={() => {
              if (recentTouchRef.current || isInTouchDragRef.current) return;
              handleWheelClick('center');
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gray-100 shadow-inner active:bg-gray-200 touch-manipulation"
          />
          
          {/* Menu button */}
          <button
            onClick={() => {
              if (recentTouchRef.current || isInTouchDragRef.current) return;
              handleWheelClick('top');
            }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 text-sm font-bold menu-button active:opacity-70 touch-manipulation"
          >
            MENU
          </button>
          
          {/* Play/Pause button */}
          <button
            onClick={() => {
              if (recentTouchRef.current || isInTouchDragRef.current) return;
              handleWheelClick('bottom');
            }}
            className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm font-bold transition-colors duration-200 active:opacity-70 touch-manipulation ${
              !isWheelMode ? 'text-[#0c5a79]' : 'text-gray-700'
            }`}
          >
            ⏯
          </button>
          
          {/* Next button */}
          <button
            onClick={() => {
              if (recentTouchRef.current || isInTouchDragRef.current) return;
              handleWheelClick('right');
            }}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-sm active:opacity-70 touch-manipulation"
          >
            ⏭
          </button>
          
          {/* Previous button */}
          <button
            onClick={() => {
              if (recentTouchRef.current || isInTouchDragRef.current) return;
              handleWheelClick('left');
            }}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 text-sm active:opacity-70 touch-manipulation"
          >
            ⏮
          </button>
        </div>
      </div>
    </div>
  );
}

export default App; 