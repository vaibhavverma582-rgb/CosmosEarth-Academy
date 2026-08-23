"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
  ListMusic,
} from "lucide-react";

interface PlayerEpisode {
  id: string;
  title: string;
  audioUrl: string;
  podcastTitle: string;
  podcastCover?: string;
  duration?: number;
}

interface StickyAudioPlayerProps {
  episode: PlayerEpisode | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export function StickyAudioPlayer({
  episode,
  onClose,
  onNext,
  onPrev,
}: StickyAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  useEffect(() => {
    if (episode?.audioUrl && audioRef.current) {
      audioRef.current.src = episode.audioUrl;
      audioRef.current.load();
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [episode?.audioUrl]);

  if (!episode) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(() => {});
    setIsPlaying(!isPlaying);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    audioRef.current.currentTime = pct * duration;
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          onNext?.();
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration);
        }}
      />

      <div className="fixed bottom-0 left-0 right-0 z-[9998] border-t border-white/10 bg-cosmos-navy/95 backdrop-blur-xl">
        {/* Progress bar (clickable) */}
        <div
          className="h-1 w-full cursor-pointer bg-white/10 hover:h-1.5 transition-all"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all"
            style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>

        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          {/* Episode info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {episode.podcastCover ? (
              <img
                src={episode.podcastCover}
                alt=""
                className="h-12 w-12 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/10">
                <ListMusic className="h-5 w-5 text-white/40" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {episode.title}
              </p>
              <p className="text-xs text-white/40 truncate">
                {episode.podcastTitle}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {onPrev && (
              <button onClick={onPrev} className="rounded-full p-2 text-white/60 hover:text-white hover:bg-white/5">
                <SkipBack className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={togglePlay}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 text-white transition-transform hover:scale-105"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" fill="white" />}
            </button>
            {onNext && (
              <button onClick={onNext} className="rounded-full p-2 text-white/60 hover:text-white hover:bg-white/5">
                <SkipForward className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Time */}
          <div className="hidden sm:block text-xs text-white/40 font-mono">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>

          {/* Speed */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="rounded-lg border border-white/10 px-2 py-1 text-xs font-medium text-white/60 hover:text-white hover:bg-white/5"
            >
              {speed}x
            </button>
            {showSpeedMenu && (
              <div className="absolute bottom-full right-0 mb-2 rounded-lg border border-white/10 bg-cosmos-navy shadow-xl p-1 animate-fade-in">
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setSpeed(s); setShowSpeedMenu(false); }}
                    className={`block w-full rounded-md px-3 py-1.5 text-xs text-left transition-colors ${
                      speed === s ? "bg-cyan-400/20 text-cyan-400" : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Volume */}
          <div className="hidden sm:flex items-center gap-2">
            <button onClick={toggleMute} className="text-white/60 hover:text-white">
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setVolume(v);
                if (audioRef.current) audioRef.current.volume = v;
                setIsMuted(v === 0);
              }}
              className="w-16 h-1 accent-cyan-400"
            />
          </div>

          {/* Close */}
          <button onClick={() => { onClose(); if (audioRef.current) audioRef.current.pause(); setIsPlaying(false); }}
            className="rounded-full p-2 text-white/40 hover:text-white hover:bg-white/5">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}
