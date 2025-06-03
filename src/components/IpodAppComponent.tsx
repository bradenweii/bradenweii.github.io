import React, { useState, useRef } from 'react';
import { IpodScreen } from './IpodScreen';
import { IpodWheel } from './IpodWheel';

// Types
type Tab = 'home' | 'me' | 'about' | 'projects' | 'instagram' | 'roomiez' | 'sign' | 'blog' | 'resume';
type MenuLevel = 'main' | 'submenu' | 'projects';
type WheelArea = 'top' | 'right' | 'bottom' | 'left' | 'center';
type RotationDirection = 'clockwise' | 'counterclockwise';

// Menu items
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

export function IpodAppComponent() {
  const [currentTab, setCurrentTab] = useState<Tab>('home');
  const [menuMode, setMenuMode] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState(0);
  const [menuLevel, setMenuLevel] = useState<MenuLevel>('main');
  const [isWheelMode, setIsWheelMode] = useState(true);

  // Refs to track previous selections
  const previousMainSelection = useRef(0);
  const previousSubSelection = useRef(0);
  const previousProjectSelection = useRef(0);

  const handleMenuItemSelect = (index: number) => {
    setSelectedMenuItem(index);
    const selectedItem = mainMenuItems[index];
    
    if (selectedItem.id === 'me') {
      previousMainSelection.current = index;
      setMenuLevel('submenu');
      setSelectedMenuItem(previousSubSelection.current);
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
      if (!items || items.length === 0) return;
      
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

  const getCurrentSelectedItem = () => {
    const items = getCurrentMenuItems();
    if (!items || items.length === 0) return null;
    const safeIndex = Math.min(selectedMenuItem, items.length - 1);
    return items[safeIndex];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 flex items-center justify-center p-4">
      <div className="w-[300px] h-[500px] bg-gradient-to-br from-[#d8d8d8] via-[#f0f0f0] to-[#c0c0c0] rounded-3xl shadow-[inset_0_2px_6px_rgba(255,255,255,0.6),_0_4px_8px_rgba(0,0,0,0.2)] border border-[#999] flex flex-col items-center p-4">
        <IpodScreen
          menuMode={menuMode}
          menuLevel={menuLevel}
          currentTab={currentTab}
          selectedMenuItem={selectedMenuItem}
          getCurrentSelectedItem={getCurrentSelectedItem}
          getCurrentMenuItems={getCurrentMenuItems}
          handleMenuItemSelect={handleMenuItemSelect}
          handleSubMenuItemSelect={handleSubMenuItemSelect}
          handleProjectSelect={handleProjectSelect}
        />
        <IpodWheel
          onWheelClick={handleWheelClick}
          onWheelRotation={handleWheelRotation}
          onMenuButton={handleMenuButton}
          isWheelMode={isWheelMode}
        />
      </div>
    </div>
  );
} 