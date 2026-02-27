import React, { useState, useRef, useEffect, useCallback } from 'react';

/* ============================================
   AudioPlayer — supports YouTube embeds and
   direct audio files (.mp3, .wav, .ogg, etc.)
   ============================================ */

interface AudioPlayerProps {
    url: string;
    accent?: string;
    compact?: boolean;  // smaller version for cards
}

/** Extract YouTube video ID from various URL formats */
function getYouTubeId(url: string): string | null {
    const patterns = [
        /youtu\.be\/([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const p of patterns) {
        const m = url.match(p);
        if (m) return m[1];
    }
    return null;
}

function isDirectAudio(url: string): boolean {
    return /\.(mp3|wav|ogg|flac|aac|m4a|webm)(\?.*)?$/i.test(url);
}

/** Compact YouTube player for cards — just a small play button / indicator */
const YouTubeEmbed: React.FC<{ videoId: string; compact?: boolean }> = ({ videoId, compact }) => {
    if (compact) {
        return (
            <a
                href={`https://youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 14px',
                    background: 'rgba(255,0,0,0.06)',
                    border: '1px solid rgba(255,0,0,0.12)',
                    borderRadius: 8,
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,0,0,0.12)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,0,0,0.06)')}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF0000">
                    <path d="M23.5 6.2c-.3-1-1-1.7-2-2C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.5.6c-1 .3-1.7 1-2 2C0 8 0 12 0 12s0 4 .5 5.8c.3 1 1 1.7 2 2 1.9.6 9.5.6 9.5.6s7.6 0 9.5-.6c1-.3 1.7-1 2-2 .5-1.8.5-5.8.5-5.8s0-4-.5-5.8zM9.6 15.6V8.4l6.4 3.6-6.4 3.6z" />
                </svg>
                <span style={{
                    fontSize: 11, fontFamily: 'var(--font-mono)',
                    color: 'var(--text-tertiary)',
                }}>Listen on YouTube</span>
            </a>
        );
    }

    return (
        <div style={{
            borderRadius: 12, overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
            aspectRatio: '16/9',
        }}>
            <iframe
                src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                title="YouTube player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: '100%', height: '100%', border: 'none' }}
            />
        </div>
    );
};

/** Native audio player with custom styling */
const NativeAudioPlayer: React.FC<{ url: string; accent: string; compact?: boolean }> = ({ url, accent, compact }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const progressBarRef = useRef<HTMLDivElement>(null);

    const togglePlay = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    }, [isPlaying]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
            setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
        };
        const onLoadedMetadata = () => setDuration(audio.duration);
        const onEnded = () => { setIsPlaying(false); setProgress(0); };

        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('ended', onEnded);
        };
    }, []);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (!progressBarRef.current || !audioRef.current) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        audioRef.current.currentTime = pct * audioRef.current.duration;
    };

    return (
        <div
            onClick={e => e.stopPropagation()}
            style={{
                display: 'flex', alignItems: 'center', gap: compact ? 10 : 14,
                padding: compact ? '8px 12px' : '14px 18px',
                background: `${accent}08`,
                border: `1px solid ${accent}15`,
                borderRadius: compact ? 8 : 12,
            }}
        >
            <audio ref={audioRef} src={url} preload="metadata" />

            {/* Play/Pause button */}
            <button
                onClick={togglePlay}
                style={{
                    width: compact ? 32 : 40, height: compact ? 32 : 40,
                    borderRadius: '50%',
                    background: `${accent}20`,
                    border: `1px solid ${accent}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', flexShrink: 0, color: accent,
                    transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = `${accent}35`)}
                onMouseLeave={e => (e.currentTarget.style.background = `${accent}20`)}
            >
                {isPlaying ? (
                    <svg width={compact ? 12 : 14} height={compact ? 12 : 14} viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                ) : (
                    <svg width={compact ? 12 : 14} height={compact ? 12 : 14} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                )}
            </button>

            {/* Progress bar */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                <div
                    ref={progressBarRef}
                    onClick={handleSeek}
                    style={{
                        height: compact ? 3 : 4, borderRadius: 2,
                        background: 'rgba(255,255,255,0.06)',
                        cursor: 'pointer', position: 'relative',
                    }}
                >
                    <div style={{
                        height: '100%', borderRadius: 2,
                        width: `${progress}%`,
                        background: `linear-gradient(90deg, ${accent}80, ${accent})`,
                        transition: 'width 0.1s linear',
                    }} />
                </div>
                {!compact && (
                    <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        fontSize: 10, fontFamily: 'var(--font-mono)',
                        color: 'var(--text-muted)',
                    }}>
                        <span>{formatTime(currentTime)}</span>
                        <span>{duration ? formatTime(duration) : '--:--'}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

/** Main AudioPlayer — routes to YouTube embed or native audio player */
export const AudioPlayer: React.FC<AudioPlayerProps> = ({ url, accent = '#00E5FF', compact = false }) => {
    const ytId = getYouTubeId(url);
    if (ytId) return <YouTubeEmbed videoId={ytId} compact={compact} />;
    if (isDirectAudio(url)) return <NativeAudioPlayer url={url} accent={accent} compact={compact} />;

    // Fallback: generic audio link
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: compact ? '8px 12px' : '10px 16px',
                background: `${accent}08`,
                border: `1px solid ${accent}15`,
                borderRadius: compact ? 8 : 12,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = `${accent}15`)}
            onMouseLeave={e => (e.currentTarget.style.background = `${accent}08`)}
        >
            <span style={{ fontSize: compact ? 14 : 18 }}>🎵</span>
            <span style={{
                fontSize: compact ? 11 : 12,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-tertiary)',
            }}>Listen to audio</span>
        </a>
    );
};
