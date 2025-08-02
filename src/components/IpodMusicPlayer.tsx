import React, { useRef, useState, useEffect } from 'react';

export type Song = {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
};

interface IpodMusicPlayerProps {
  song: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSetToggleVideo?: (toggleFn: () => void) => void;
  showInterface?: boolean;
}

export function IpodMusicPlayer({
  song,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onSetToggleVideo,
  showInterface = true
}: IpodMusicPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [hasError, setHasError] = useState(false);
  const [playerKey, setPlayerKey] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [trackNumber, setTrackNumber] = useState(1);

  // Only reset player when song actually changes
  const [lastSongId, setLastSongId] = useState<string | null>(null);
  const [isPlayerInitialized, setIsPlayerInitialized] = useState(false);
  
  useEffect(() => {
    if (song) {
      if (song.id !== lastSongId) {
        // Only reset if it's actually a different song
        setHasError(false);
        setPlayerKey(prev => prev + 1);
        setCurrentTime(0);
        setDuration(0);
        setShowVideo(false);
        setLastSongId(song.id);
        setIsPlayerInitialized(false);
        // Set track number based on song ID
        setTrackNumber(parseInt(song.id) || 1);
      } else {
        // Same song, just update track number if needed - don't reset anything else
        setTrackNumber(parseInt(song.id) || 1);
      }
    }
  }, [song, lastSongId]);

  // Handle iframe loading and auto-play - only when song actually changes
  useEffect(() => {
    if (song && iframeRef.current && !isPlayerInitialized) {
      try {
        // Optimized parameters for seamless background playback
        const baseUrl = `https://www.youtube.com/embed/${song.youtubeId}?autoplay=1&mute=0&controls=${showVideo ? 1 : 0}&disablekb=1&fs=0&modestbranding=1&playsinline=1&rel=0&enablejsapi=1&origin=${window.location.origin}`;
        
        iframeRef.current.src = baseUrl;
        setIsPlayerInitialized(true);
      } catch (error) {
        console.error('Error updating iframe:', error);
        setHasError(true);
      }
    }
  }, [song, showVideo, isPlayerInitialized]);

  // Handle play/pause via postMessage
  useEffect(() => {
    if (song && iframeRef.current && !showVideo && isPlayerInitialized) {
      const timer = setTimeout(() => {
        try {
          const command = isPlaying ? '{"event":"command","func":"playVideo","args":""}' : '{"event":"command","func":"pauseVideo","args":""}';
          iframeRef.current?.contentWindow?.postMessage(command, 'https://www.youtube.com');
        } catch (error) {
          console.error('Error controlling playback via postMessage:', error);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isPlaying, song, showVideo, isPlayerInitialized]);

  // Simulate progress (since we can't get real progress from iframe easily)
  useEffect(() => {
    if (isPlaying && !showVideo) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (duration > 0 && prev >= duration) {
            onNext(); // Auto-advance to next song
            return 0;
          }
          return prev + 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, duration, onNext, showVideo]);

  // Set estimated duration when song loads
  useEffect(() => {
    if (song && duration === 0) {
      // Set estimated duration (you could fetch real duration via YouTube API)
      setDuration(180); // Default 3 minutes
    }
  }, [song, duration]);

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle center button click to toggle video view
  const handleCenterClick = () => {
    setShowVideo(prev => !prev);
  };

  // Register toggle function with parent
  useEffect(() => {
    if (onSetToggleVideo) {
      onSetToggleVideo(handleCenterClick);
    }
  }, [onSetToggleVideo]);

  // Always render player, but handle no song case gracefully
  if (!song) {
    return showInterface ? (
      <div className="w-full h-[240px] bg-[#c5e0f5] rounded-lg border-2 border-gray-400 mb-6 overflow-hidden lcd-screen flex flex-col items-center justify-center">
        <p className="text-[#0c5a79] font-chicago">No song loaded</p>
      </div>
    ) : (
      <div className="hidden">
        <p>No song loaded</p>
      </div>
    );
  }

  if (showInterface && showVideo) {
    // Video view mode
    return (
      <div className="w-full h-[240px] bg-black rounded-lg border-2 border-ipod-blue mb-6 overflow-hidden relative">
        <iframe
          key={`${song.id}-${playerKey}-video`}
          ref={iframeRef}
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${song.youtubeId}?autoplay=1&mute=0&controls=1&disablekb=0&fs=1&modestbranding=1&playsinline=1&rel=0&enablejsapi=1&origin=${window.location.origin}`}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="rounded-lg"
          title={`${song.title} by ${song.artist}`}
        />
        <button
          onClick={handleCenterClick}
          className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs"
        >
          Back to iPod
        </button>
      </div>
    );
  }

  if (!showInterface) {
    // Hidden background player mode - just the iframe for music
    return (
      <div className="hidden">
        {song.youtubeId && !hasError && (
          <iframe
            key={`${song.id}-${playerKey}`}
            ref={iframeRef}
            width="0"
            height="0"
            src={`https://www.youtube.com/embed/${song.youtubeId}?autoplay=1&mute=0&controls=0&disablekb=1&fs=0&modestbranding=1&playsinline=1&rel=0&enablejsapi=1&origin=${window.location.origin}`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            onError={() => setHasError(true)}
            title={`${song.title} by ${song.artist}`}
          />
        )}
      </div>
    );
  }

  // iPod interface view (visible when showInterface is true)
  return (
    <div className="w-full h-[240px] bg-[#c5e0f5] rounded-lg border-2 border-gray-400 mb-6 overflow-hidden lcd-screen flex flex-col">
      {/* Top Header Bar */}
      <div className="h-6 bg-gradient-to-b from-[#a0c9e8] to-[#7db8e0] border-b border-[#0c5a79] flex items-center justify-between px-2">
        {/* Play/Pause Button */}
        <button 
          onClick={onPlayPause}
          className="text-xs text-[#0c5a79] hover:text-[#0a3667] font-chicago"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        
        {/* Now Playing Title */}
        <span className="text-xs font-bold text-[#0c5a79] font-chicago">Now Playing</span>
        <div className="flex items-center">
  {/* Battery Body */}
  <div className="relative flex gap-[1px] w-[30px] h-[12px] border-[2px] border-[#0c5a79] box-content">
    {/* Battery Segments */}
    <div className="bg-[#0c5a79] w-[5px] h-full" />
    <div className="bg-[#0c5a79] w-[5px] h-full" />
    <div className="bg-[#0c5a79] w-[5px] h-full" />
    <div className="bg-[#0c5a79] w-[5px] h-full" />
    
    {/* Battery Cap */}
    <div className="absolute top-[3px] -right-[4px] w-[2px] h-[6px] bg-[#0c5a79]" />
  </div>
</div>
</div>

      {/* Track Info */}
      <div className="flex-1 flex flex-col justify-center px-4 py-2">
        {/* Track number */}
        <div className="text-center mb-1">
          <span className="text-xs text-[#0c5a79] font-chicago">{trackNumber} of 13</span>
        </div>

        {/* Song Title */}
        <div className="text-center mb-2">
          <h2 className="text-sm font-bold text-[#0c5a79] font-chicago leading-tight max-w-[200px] truncate mx-auto">
            {song.title}
          </h2>
        </div>

        {/* Artist */}
        <div className="text-center mb-4">
          <p className="text-xs text-[#0c5a79] font-chicago max-w-[200px] truncate mx-auto">
            {song.artist}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full mb-2">
          <div className="h-1 bg-[#a0c9e8] rounded-full border border-[#0c5a79] relative">
            <div 
              className="h-full bg-[#0c5a79] rounded-full transition-all duration-1000" 
              style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
            ></div>
          </div>
        </div>

        {/* Time Display */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-[#0c5a79] font-chicago">{formatTime(currentTime)}</span>
          <span className="text-xs text-[#0c5a79] font-chicago">
            -{formatTime(Math.max(0, duration - currentTime))}
          </span>
        </div>
      </div>

      {/* Hidden YouTube iframe player for audio */}
      <div className="hidden">
        {song.youtubeId && !hasError && (
          <iframe
            key={`${song.id}-${playerKey}`}
            ref={iframeRef}
            width="0"
            height="0"
            src={`https://www.youtube.com/embed/${song.youtubeId}?autoplay=1&mute=0&controls=0&disablekb=1&fs=0&modestbranding=1&playsinline=1&rel=0&enablejsapi=1&origin=${window.location.origin}`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            onError={() => setHasError(true)}
            title={`${song.title} by ${song.artist}`}
          />
        )}
      </div>
    </div>
  );
}