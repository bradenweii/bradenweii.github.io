import React, { useState, useRef, useCallback, useEffect } from 'react';
import { IpodScreen } from './IpodScreen';
import { IpodWheel } from './IpodWheel';
import { IpodMusicPlayer, Song } from './IpodMusicPlayer';

// Types
type Tab = 'home' | 'me' | 'about' | 'projects' | 'instagram' | 'roomiez' | 'sign' | 'blog' | 'resume' | 'music';
type MenuLevel = 'main' | 'submenu' | 'projects' | 'music' | 'music-artists' | 'music-artist-songs' | 'now-playing';
type WheelArea = 'top' | 'right' | 'bottom' | 'left' | 'center';
type RotationDirection = 'clockwise' | 'counterclockwise';

// Menu items
const mainMenuItems = [
  { id: 'home', label: 'Home' },
  { id: 'me', label: 'Me' },
  { id: 'music', label: 'Music' },
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

// Music library organized by artists
const musicLibrary: Song[] = [
  // Nujabes
  {
    id: '1',
    title: 'aruarian dance',
    artist: 'Nujabes',
    youtubeId: 'qYcoJpqCha4'  // Original video ID you wanted
  },
  {
    id: '2',
    title: 'Luv (sic.) , Pt. 3 (feat. Shing02)',
    artist: 'Nujabes',
    youtubeId: 'dcYJg5gGHC0'
  },
  {
    id: '3',
    title: 'world without words',
    artist: 'Nujabes',
    youtubeId: 'Bi5kyehmeaY'
  },
//  
  {
    id: '4',
    title: 'lady brown',
    artist: 'Nujabes',
    youtubeId: 'R5dphZnPb9A'
  },
  // J Dilla
  {
    id: '5',
    title: 'Life',
    artist: 'J Dilla',
    youtubeId: 'WQlHYtz5Zc4'
  },
  {
    id: '6',
    title: "Don't Cry",
    artist: 'J Dilla',
    youtubeId: 'cq0ZsnKuHpk'
  },
  {
    id: '7',
    title: 'Time: The Donut of the Heart',
    artist: 'J Dilla',
    youtubeId: 'ClS0RBWpBUE'
  },
  {
    id: '8',
    title: 'Last Donut of the Night',
    artist: 'J Dilla',
    youtubeId: 'fC3Cthm0HFU'
  },
  // Mac DeMarco
  {
    id: '9',
    title: 'Chamber of Reflection',
    artist: 'Mac DeMarco',
    youtubeId: 'NY8IS0ssnXQ'
  },
  {
    id: '10',
    title: 'Dreamin',
    artist: 'Mac DeMarco',
    youtubeId: 'mzBwKOGOmGw'
  },
  {
    id: '11',
    title: 'Salad Days',
    artist: 'Mac DeMarco',
    youtubeId: 'RheJW2nhkb8'
  },
  {
    id: '12',
    title: 'My Kind of Woman',
    artist: 'Mac DeMarco',
    youtubeId: 'wIuVkoOo_1w'
  },
  // Faye Webster
  {
    id: '13',
    title: 'Kind Of',
    artist: 'Faye Webster',
    youtubeId: 'GNJTdyESMgk'
  }
];

// Music menu structure
const musicMenuItems = [
  { id: 'all-songs', label: 'All Songs' },
  { id: 'artists', label: 'Artists' },
  { id: 'albums', label: 'Albums' },
  { id: 'playlists', label: 'Playlists' }
];

// Get unique artists from music library
const getArtists = () => {
  const artists = Array.from(new Set(musicLibrary.map(song => song.artist)));
  return artists.map((artist, index) => ({ id: `artist-${index}`, label: artist }));
};

// Get songs by artist
const getSongsByArtist = (artistName: string) => {
  return musicLibrary.filter(song => song.artist === artistName);
};

export function IpodAppComponent() {
  const [currentTab, setCurrentTab] = useState<Tab>('home');
  const [menuMode, setMenuMode] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState(0);
  const [menuLevel, setMenuLevel] = useState<MenuLevel>('main');
  const [isWheelMode, setIsWheelMode] = useState(true);
  
  // Music player state - Auto-start with first song
  const [currentSong, setCurrentSong] = useState<Song | null>(musicLibrary[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  
  // Music navigation state
  const [currentArtistSongs, setCurrentArtistSongs] = useState<Song[]>([]);
  
  // Video toggle state
  const [toggleVideoMode, setToggleVideoMode] = useState<(() => void) | null>(null);

  // Auto-start music on component mount
  useEffect(() => {
    // Ensure first song is set and playing on initial load
    if (!currentSong && musicLibrary.length > 0) {
      setCurrentSong(musicLibrary[0]);
      setCurrentSongIndex(0);
      setIsPlaying(true);
    }
  }, [currentSong]);

  // Music player controls
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextSong = () => {
    const nextIndex = (currentSongIndex + 1) % musicLibrary.length;
    const nextSong = musicLibrary[nextIndex];
    
    // Only update if it's actually a different song
    if (currentSong?.id !== nextSong.id) {
      setCurrentSongIndex(nextIndex);
      setCurrentSong(nextSong);
    }
  };

  const handlePreviousSong = () => {
    const prevIndex = (currentSongIndex - 1 + musicLibrary.length) % musicLibrary.length;
    const prevSong = musicLibrary[prevIndex];
    
    // Only update if it's actually a different song
    if (currentSong?.id !== prevSong.id) {
      setCurrentSongIndex(prevIndex);
      setCurrentSong(prevSong);
    }
  };

  // Refs to track previous selections
  const previousMainSelection = useRef(0);
  const previousSubSelection = useRef(0);
  const previousProjectSelection = useRef(0);
  const previousMusicSelection = useRef(0);
  const previousArtistSelection = useRef(0);
  const previousArtistSongSelection = useRef(0);

  // Helper function to ensure safe index within bounds
  const getSafeIndex = (index: number, arrayLength: number): number => {
    if (arrayLength === 0) return 0;
    return Math.max(0, Math.min(index, arrayLength - 1));
  };

  const handleMenuItemSelect = useCallback((index: number) => {
    const selectedItem = mainMenuItems[index];
    
    if (selectedItem.id === 'me') {
      // Navigate to submenu
      previousMainSelection.current = index;
      setMenuLevel('submenu');
      setSelectedMenuItem(getSafeIndex(previousSubSelection.current, subMenuItems.length));
    } else if (selectedItem.id === 'music') {
      // Navigate to music menu
      previousMainSelection.current = index;
      setMenuLevel('music');
      setSelectedMenuItem(getSafeIndex(previousMusicSelection.current, musicMenuItems.length));
    } else {
      // Navigate to content tab
      previousMainSelection.current = index;
      setMenuMode(false);
      setCurrentTab(selectedItem.id as Tab);
    }
  }, []);

  const handleSubMenuItemSelect = (index: number) => {
    const selectedItem = subMenuItems[index];
    previousSubSelection.current = index;
    
    if (selectedItem.id === 'projects') {
      // Navigate to projects menu
      setMenuLevel('projects');
      setSelectedMenuItem(getSafeIndex(previousProjectSelection.current, projectItems.length));
    } else {
      // Navigate to content tab
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

  // Music navigation handlers
  const handleMusicMenuSelect = (index: number) => {
    const selectedItem = musicMenuItems[index];
    previousMusicSelection.current = index;
    
    if (selectedItem.id === 'all-songs') {
      // Go directly to all songs list
      setCurrentArtistSongs(musicLibrary);
      setMenuLevel('music-artist-songs');
      // Find the current song in the list if it exists, otherwise start from first song
      const currentSongIndex = currentSong ? musicLibrary.findIndex(s => s.id === currentSong.id) : 0;
      setSelectedMenuItem(currentSongIndex >= 0 ? currentSongIndex : 0);
    } else if (selectedItem.id === 'artists') {
      // Go to artists list
      setMenuLevel('music-artists');
      setSelectedMenuItem(getSafeIndex(previousArtistSelection.current, getArtists().length));
    }
    // Add more cases for albums, playlists later
  };

  const handleArtistSelect = (index: number) => {
    const artists = getArtists();
    const selectedArtist = artists[index];
    previousArtistSelection.current = index;
    
    const artistSongs = getSongsByArtist(selectedArtist.label);
    setCurrentArtistSongs(artistSongs);
    setMenuLevel('music-artist-songs');
    
    // If current song is by this artist, highlight it in the list
    const currentSongInArtist = currentSong ? artistSongs.findIndex(s => s.id === currentSong.id) : -1;
    if (currentSongInArtist >= 0) {
      setSelectedMenuItem(currentSongInArtist);
    } else {
      setSelectedMenuItem(getSafeIndex(previousArtistSongSelection.current, artistSongs.length));
    }
  };

  const handleArtistSongSelect = (index: number) => {
    const song = currentArtistSongs[index];
    previousArtistSongSelection.current = index;
    
    const newSongIndex = musicLibrary.findIndex(s => s.id === song.id);
    const isSameSong = currentSong?.id === song.id;
    
    // Only update song and playing state if it's actually a different song
    if (!isSameSong) {
      setCurrentSong(song);
      setCurrentSongIndex(newSongIndex);
      setIsPlaying(true); // Auto-play new songs
    }
    // If same song, don't change anything about the player state
    
    setMenuLevel('now-playing');
    setMenuMode(false);
  };

  const handleMenuButton = () => {
    if (!menuMode) {
      setMenuMode(true);
      // Handle returning from Now Playing mode
      if (menuLevel === 'now-playing') {
        setMenuLevel('music-artist-songs');
        setSelectedMenuItem(previousArtistSongSelection.current);
        return;
      }
      
      if (currentTab === 'instagram' || currentTab === 'roomiez' || currentTab === 'sign') {
        setMenuLevel('projects');
        setSelectedMenuItem(getSafeIndex(previousProjectSelection.current, projectItems.length));
      } else if (currentTab === 'about' || currentTab === 'blog' || currentTab === 'resume') {
        setMenuLevel('submenu');
        const index = subMenuItems.findIndex(item => item.id === currentTab);
        const safeIndex = index >= 0 ? index : getSafeIndex(previousSubSelection.current, subMenuItems.length);
        setSelectedMenuItem(safeIndex);
      } else {
        setMenuLevel('main');
        setSelectedMenuItem(getSafeIndex(previousMainSelection.current, mainMenuItems.length));
      }
    } else {
      switch (menuLevel) {
        case 'music-artist-songs':
          if (currentArtistSongs === musicLibrary) {
            // Coming from "All Songs"
            setMenuLevel('music');
            setSelectedMenuItem(getSafeIndex(previousMusicSelection.current, musicMenuItems.length));
          } else {
            // Coming from specific artist
            setMenuLevel('music-artists');
            setSelectedMenuItem(getSafeIndex(previousArtistSelection.current, getArtists().length));
          }
          break;
        case 'music-artists':
          setMenuLevel('music');
          setSelectedMenuItem(getSafeIndex(previousMusicSelection.current, musicMenuItems.length));
          break;
        case 'music':
          setMenuLevel('main');
          setSelectedMenuItem(getSafeIndex(previousMainSelection.current, mainMenuItems.length));
          break;
        case 'projects':
          setMenuLevel('submenu');
          setSelectedMenuItem(getSafeIndex(previousSubSelection.current, subMenuItems.length));
          break;
        case 'submenu':
          setMenuLevel('main');
          setSelectedMenuItem(getSafeIndex(previousMainSelection.current, mainMenuItems.length));
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
        if (menuLevel === 'now-playing') {
          handleNextSong();
        } else if (!menuMode) {
          const nextIndex = (selectedMenuItem + 1) % mainMenuItems.length;
          handleMenuItemSelect(nextIndex);
        }
        break;
      case 'bottom':
        if (menuLevel === 'now-playing') {
          handlePlayPause();
        } else if (!menuMode) {
          setIsWheelMode(!isWheelMode);
        }
        break;
      case 'left':
        if (menuLevel === 'now-playing') {
          handlePreviousSong();
        } else if (!menuMode) {
          const prevIndex = (selectedMenuItem - 1 + mainMenuItems.length) % mainMenuItems.length;
          handleMenuItemSelect(prevIndex);
        }
        break;
      case 'center':
        if (menuLevel === 'now-playing') {
          // Toggle video mode in now-playing mode
          if (toggleVideoMode) {
            toggleVideoMode();
          }
        } else if (menuMode) {
          if (menuLevel === 'projects') {
            handleProjectSelect(selectedMenuItem);
          } else if (menuLevel === 'submenu') {
            handleSubMenuItemSelect(selectedMenuItem);
          } else if (menuLevel === 'music') {
            handleMusicMenuSelect(selectedMenuItem);
          } else if (menuLevel === 'music-artists') {
            handleArtistSelect(selectedMenuItem);
          } else if (menuLevel === 'music-artist-songs') {
            handleArtistSongSelect(selectedMenuItem);
          } else {
            handleMenuItemSelect(selectedMenuItem);
          }
        }
        break;
    }
  };

  const handleWheelRotation = (direction: RotationDirection) => {
    if (menuMode) {
      let items;
      switch (menuLevel) {
        case 'music':
          items = musicMenuItems;
          break;
        case 'music-artists':
          items = getArtists();
          break;
        case 'music-artist-songs':
          items = currentArtistSongs.map((song, index) => ({ id: song.id, label: song.title }));
          break;
        case 'projects':
          items = projectItems;
          break;
        case 'submenu':
          items = subMenuItems;
          break;
        default:
          items = mainMenuItems;
      }
      
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
      case 'music':
        return musicMenuItems;
      case 'music-artists':
        return getArtists();
      case 'music-artist-songs':
        return currentArtistSongs.map((song, index) => ({ id: song.id, label: song.title }));
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
        {/* Single persistent music player - always mounted */}
        <IpodMusicPlayer
          song={currentSong}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNextSong}
          onPrevious={handlePreviousSong}
          onSetToggleVideo={setToggleVideoMode}
          showInterface={menuLevel === 'now-playing'}
        />
        
        {/* iPod Screen - only show when not in now-playing mode */}
        {menuLevel !== 'now-playing' && (
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
            handleMusicMenuSelect={handleMusicMenuSelect}
            handleArtistSelect={handleArtistSelect}
            handleArtistSongSelect={handleArtistSongSelect}
          />
        )}
        
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