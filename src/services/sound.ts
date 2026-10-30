// Web Audio API Synthesizer and Haptics Engine for MindFlip
// Offline-first, zero external audio assets required

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled = true;
  private musicEnabled = true;
  private hapticsEnabled = true;
  private musicGainNode: GainNode | null = null;
  private isMusicPlaying = false;
  private musicTimer: number | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (!enabled) {
      this.stopAmbientMusic();
    } else {
      this.startAmbientMusic();
    }
  }

  public setHapticsEnabled(enabled: boolean) {
    this.hapticsEnabled = enabled;
  }

  // Haptic feedback using navigator.vibrate
  public vibrate(pattern: number | number[] = 20) {
    if (!this.hapticsEnabled || typeof navigator === 'undefined' || !navigator.vibrate) {
      return;
    }
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore unsupported platforms
    }
  }

  // Crisp Button Tap / Wooden click
  public playTap() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.05);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);

      this.vibrate(10);
    } catch {
      // safe fallback
    }
  }

  // Whoosh / Slide Transition sound
  public playWhoosh() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  // Uplifting Level Complete / Victory Fanfare
  public playSuccess() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
      const noteDuration = 0.09;
      const start = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start + idx * noteDuration);

        gain.gain.setValueAtTime(0, start + idx * noteDuration);
        gain.gain.linearRampToValueAtTime(0.25, start + idx * noteDuration + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + idx * noteDuration + (idx === 3 ? 0.35 : 0.15));

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(start + idx * noteDuration);
        osc.stop(start + idx * noteDuration + (idx === 3 ? 0.38 : 0.18));
      });

      this.vibrate([30, 50, 40]);
    } catch {}
  }

  // Gentle Wrong Buzz / Spring wobble
  public playWrong() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(95, now + 0.18);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.23);

      this.vibrate([60, 40, 60]);
    } catch {}
  }

  // Sparkling Hint / Magic bell chime
  public playHint() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [880, 1174.66, 1760].forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        gain.gain.setValueAtTime(0.15, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.28);
      });

      this.vibrate(25);
    } catch {}
  }

  // Coin Collection Ding
  public playCoin() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [987.77, 1318.51].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.2, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.16);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.18);
      });
      this.vibrate(15);
    } catch {}
  }

  // Star Earned sound
  public playStar(starIndex: number = 0) {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const pitches = [523.25, 659.25, 783.99]; // C5, E5, G5
      const freq = pitches[starIndex % pitches.length];
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }

  // Calming Ambient Synth Lofi Loop (Subtle, relaxing, non-intrusive)
  public startAmbientMusic() {
    if (!this.musicEnabled || this.isMusicPlaying) return;
    this.initContext();
    if (!this.ctx) return;

    this.isMusicPlaying = true;
    const playNextChord = () => {
      if (!this.musicEnabled || !this.isMusicPlaying || !this.ctx) return;
      
      try {
        const chords = [
          [261.63, 329.63, 392.00], // C maj
          [220.00, 261.63, 329.63], // A min
          [174.61, 220.00, 261.63], // F maj
          [196.00, 246.94, 293.66], // G maj
        ];
        const chord = chords[Math.floor(Math.random() * chords.length)];
        const now = this.ctx.currentTime;

        chord.forEach(freq => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.02, now + 1.2);
          gain.gain.linearRampToValueAtTime(0, now + 3.8);

          osc.connect(gain);
          gain.connect(this.ctx!.destination);

          osc.start(now);
          osc.stop(now + 4.0);
        });
      } catch {}

      this.musicTimer = window.setTimeout(playNextChord, 4000);
    };

    playNextChord();
  }

  public stopAmbientMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }
}

export const sound = new SoundEngine();
