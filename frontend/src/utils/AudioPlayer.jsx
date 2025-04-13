import React, { useState, useEffect, useRef, useContext } from "react";
import { SongContext } from "../Context/SongContext";
import { CiPlay1, CiPause1 } from "react-icons/ci";
import { FiSkipBack, FiSkipForward } from "react-icons/fi";
import { IoVolumeHigh, IoVolumeMedium, IoVolumeLow, IoVolumeMute } from "react-icons/io5";

const AudioPlayer = () => {
  const { song, audio } = useContext(SongContext);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const progressBar = useRef();
  const volumeBar = useRef();
  const progressContainer = useRef();

  // Update duration and time
  useEffect(() => {
    const updateMetadata = () => {
      setDuration(audio.duration);
      progressBar.current.max = audio.duration;
    };

    const updateTime = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime);
      }
    };

    audio.addEventListener("loadedmetadata", updateMetadata);
    audio.addEventListener("timeupdate", updateTime);

    return () => {
      audio.removeEventListener("loadedmetadata", updateMetadata);
      audio.removeEventListener("timeupdate", updateTime);
    };
  }, [audio.src, isDragging]);

  // Handle volume changes
  useEffect(() => {
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!song.songUrl) return;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
    song.setIsPlaying(!song.isPlaying);
  };

  // Handle progress bar interaction
  const handleProgressClick = (e) => {
    const rect = progressContainer.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * duration;
    setCurrentTime(audio.currentTime);
  };

  const handleProgressDragStart = () => {
    setIsDragging(true);
  };

  const handleProgressDragEnd = (e) => {
    setIsDragging(false);
    const rect = progressContainer.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * duration;
    setCurrentTime(audio.currentTime);
  };

  // Handle volume changes
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Calculate time
  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  // Get volume icon based on level
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <IoVolumeMute size={20} />;
    if (volume < 0.3) return <IoVolumeLow size={20} />;
    if (volume < 0.7) return <IoVolumeMedium size={20} />;
    return <IoVolumeHigh size={20} />;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-3 shadow-2xl z-50">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Song Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 bg-gray-700 rounded-lg overflow-hidden shadow-md flex-shrink-0">
            {song.songImage ? (
              <img 
                src={song.songImage} 
                alt={song.songName} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                <span className="text-xl">🎵</span>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-medium truncate text-sm md:text-base">
              {song.songName || "No song selected"}
            </h3>
            <p className="text-gray-400 text-xs md:text-sm truncate">
              {song.songArtist || "Unknown artist"}
            </p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center w-full md:w-auto gap-2 flex-grow md:flex-grow-0">
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="Previous song"
            >
              <FiSkipBack size={20} />
            </button>
            
            <button 
              onClick={togglePlayPause}
              className={`p-2 rounded-full ${song.isPlaying ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-700 transition-colors`}
              aria-label={song.isPlaying ? "Pause" : "Play"}
              disabled={!song.songUrl}
            >
              {song.isPlaying ? (
                <CiPause1 size={24} className="text-white" />
              ) : (
                <CiPlay1 size={24} className="text-white" />
              )}
            </button>
            
            <button 
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="Next song"
            >
              <FiSkipForward size={20} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full flex items-center gap-2">
            <span className="text-xs text-gray-400 w-10 text-right">
              {calculateTime(currentTime)}
            </span>
            <div 
              ref={progressContainer}
              className="relative h-2 bg-gray-700 rounded-full flex-grow cursor-pointer group"
              onClick={handleProgressClick}
              onMouseDown={handleProgressDragStart}
              onMouseUp={handleProgressDragEnd}
              onMouseLeave={() => setIsDragging(false)}
            >
              <div 
                className="absolute h-full bg-blue-600 rounded-full"
                style={{ width: `${(currentTime / duration ) * 100}%` }}
              />
              <div 
                className="absolute w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${(currentTime / duration) * 100}%`, transform: 'translateX(-50%) translateY(-25%)' }}
              />
            </div>
            <span className="text-xs text-gray-400 w-10">
              {duration && !isNaN(duration) ? calculateTime(duration) : "00:00"}
            </span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleMute}
            className="text-gray-300 hover:text-white transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {getVolumeIcon()}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 md:w-24 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #fff 0%, #fff ${(isMuted ? 0 : volume) * 100}%, #4b5563 ${(isMuted ? 0 : volume) * 100}%, #4b5563 100%)`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;