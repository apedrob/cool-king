/**
 * Audio Manager — Manages background music per game screen/phase.
 * Fades between tracks, loops where appropriate, respects user mute.
 */

export type TrackId = 'lobby' | 'bidding' | 'playing' | 'scoring' | 'gameover' | 'silence';

interface Track {
    src: string;
    loop: boolean;
    volume: number;
}

const TRACKS: Record<Exclude<TrackId, 'silence'>, Track> = {
    lobby: { src: '/audio/lobby.mp3', loop: true, volume: 0.35 },
    bidding: { src: '/audio/bidding.mp3', loop: false, volume: 0.30 },
    playing: { src: '/audio/playing.mp3', loop: true, volume: 0.25 },
    scoring: { src: '/audio/scoring.mp3', loop: true, volume: 0.30 },
    gameover: { src: '/audio/gameover.mp3', loop: false, volume: 0.40 },
};

const FADE_DURATION = 800; // ms

class AudioManager {
    private current: HTMLAudioElement | null = null;
    private currentTrack: TrackId = 'silence';
    private muted = false;
    private masterVolume = 1;
    private unlocked = false;

    constructor() {
        // Restore mute preference
        try {
            this.muted = localStorage.getItem('audio-muted') === 'true';
        } catch { /* ignored */ }

        // Register a persistent unlock listener — browsers require a user gesture
        // before audio can play. This retries on every interaction until it works.
        const unlock = () => {
            if (this.unlocked) {
                document.removeEventListener('pointerdown', unlock, true);
                document.removeEventListener('keydown', unlock, true);
                document.removeEventListener('touchstart', unlock, true);
                return;
            }
            this.tryResume();
        };
        document.addEventListener('pointerdown', unlock, true);
        document.addEventListener('keydown', unlock, true);
        document.addEventListener('touchstart', unlock, true);
    }

    /** Attempt to start/resume audio after a user gesture. */
    private tryResume() {
        if (this.currentTrack === 'silence' || !this.current) return;
        const audio = this.current;
        const cfg = TRACKS[this.currentTrack];
        if (audio.paused) {
            audio.play().then(() => {
                this.unlocked = true;
                this.fadeIn(audio, cfg.volume * this.masterVolume);
            }).catch(() => { /* still blocked, will retry on next gesture */ });
        }
    }

    /** Switch to a new track with crossfade. */
    play(trackId: TrackId) {
        if (trackId === this.currentTrack) return;
        this.currentTrack = trackId;

        // Fade out current
        if (this.current) {
            this.fadeOut(this.current);
            this.current = null;
        }

        if (trackId === 'silence') return;

        const cfg = TRACKS[trackId];
        const audio = new Audio(cfg.src);
        audio.loop = cfg.loop;
        audio.volume = 0;
        audio.muted = this.muted;

        this.current = audio;

        // Try to play — may be blocked by autoplay policy
        audio.play().then(() => {
            this.unlocked = true;
            this.fadeIn(audio, cfg.volume * this.masterVolume);
        }).catch(() => {
            // Autoplay blocked — the persistent unlock listener will retry
        });
    }

    /** Toggle mute. Returns new muted state. */
    toggleMute(): boolean {
        this.muted = !this.muted;
        try {
            localStorage.setItem('audio-muted', String(this.muted));
        } catch { /* ignored */ }

        if (this.current) {
            this.current.muted = this.muted;
        }
        return this.muted;
    }

    isMuted(): boolean {
        return this.muted;
    }

    /** Set master volume (0-1). */
    setVolume(v: number) {
        this.masterVolume = Math.max(0, Math.min(1, v));
        if (this.current && this.currentTrack !== 'silence') {
            const cfg = TRACKS[this.currentTrack];
            this.current.volume = cfg.volume * this.masterVolume;
        }
    }

    /** Stop everything. */
    stop() {
        this.play('silence');
    }

    private fadeIn(audio: HTMLAudioElement, targetVolume: number) {
        const steps = 20;
        const stepTime = FADE_DURATION / steps;
        const volumeStep = targetVolume / steps;
        let currentStep = 0;

        audio.volume = 0;
        const interval = setInterval(() => {
            currentStep++;
            audio.volume = Math.min(volumeStep * currentStep, targetVolume);
            if (currentStep >= steps) {
                clearInterval(interval);
            }
        }, stepTime);
    }

    private fadeOut(audio: HTMLAudioElement) {
        const startVolume = audio.volume;
        if (startVolume === 0) {
            audio.pause();
            return;
        }

        const steps = 15;
        const stepTime = FADE_DURATION / steps;
        const volumeStep = startVolume / steps;
        let currentStep = 0;

        const interval = setInterval(() => {
            currentStep++;
            audio.volume = Math.max(startVolume - volumeStep * currentStep, 0);
            if (currentStep >= steps) {
                clearInterval(interval);
                audio.pause();
                audio.src = '';
            }
        }, stepTime);
    }
}

/** Singleton audio manager */
export const audioManager = new AudioManager();
