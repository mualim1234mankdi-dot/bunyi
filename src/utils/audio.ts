/**
 * Web Audio API synthesizer for Sound Physics Lab
 * All sound is synthesized programmatically without external MP3 assets.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private toneOsc: OscillatorNode | null = null;
  private toneGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.35, this.ctx.currentTime, 0.05);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Continuous pure tone (used for C.R.O & Tuning Fork simulation)
   */
  public startTone(freq: number, volume = 0.5) {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    if (!this.toneOsc) {
      this.toneOsc = this.ctx.createOscillator();
      this.toneGain = this.ctx.createGain();
      this.toneOsc.type = 'sine';
      this.toneOsc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      this.toneGain.gain.setValueAtTime(volume * 0.4, this.ctx.currentTime);
      this.toneOsc.connect(this.toneGain);
      this.toneGain.connect(this.masterGain);
      this.toneOsc.start();
    } else {
      this.toneOsc.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.02);
      if (this.toneGain) {
        this.toneGain.gain.setTargetAtTime(volume * 0.4, this.ctx.currentTime, 0.02);
      }
    }
  }

  public updateTone(freq: number, volume = 0.5) {
    if (!this.ctx || !this.toneOsc || !this.toneGain) return;
    this.toneOsc.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.02);
    this.toneGain.gain.setTargetAtTime(volume * 0.4, this.ctx.currentTime, 0.02);
  }

  public stopTone() {
    if (this.toneGain && this.ctx) {
      this.toneGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      setTimeout(() => {
        if (this.toneOsc) {
          try {
            this.toneOsc.stop();
            this.toneOsc.disconnect();
          } catch {
            // Already stopped
          }
          this.toneOsc = null;
        }
      }, 70);
    }
  }

  /**
   * Electric Bell strike sound inside Bell Jar
   * Volume scales with air pressure (0 kPa to 100 kPa)
   */
  public playBellStrike(pressureFraction: number = 1.0) {
    if (pressureFraction <= 0.01) return; // In vacuum, zero acoustic transmission
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Metallic chime frequency
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1480, t);
    osc.frequency.exponentialRampToValueAtTime(840, t + 0.12);

    const actualVol = Math.max(0, Math.min(1, pressureFraction)) * 0.25;
    gain.gain.setValueAtTime(actualVol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.16);
  }

  /**
   * Electronic starting pistol shot BANG (Investigation 14A)
   */
  public playPistolShot() {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.04));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, t);
    filter.frequency.exponentialRampToValueAtTime(120, t + 0.25);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
  }

  /**
   * Hand clap with delayed echo
   * @param delaySeconds - Delay before echo is heard (2d / v)
   * @param echoVolumeRatio - Echo is slightly softer due to absorption and distance
   */
  public playClapWithEcho(delaySeconds: number, echoVolumeRatio = 0.5) {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const playSingleClap = (startTime: number, vol: number) => {
      if (!this.ctx || !this.masterGain) return;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.1);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.015));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(vol, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.09);

      noise.connect(gain);
      gain.connect(this.masterGain);
      noise.start(startTime);
    };

    const now = this.ctx.currentTime;
    // Initial clap
    playSingleClap(now, 0.5);

    // Reflected echo clap
    if (delaySeconds > 0.02) {
      playSingleClap(now + delaySeconds, 0.5 * echoVolumeRatio);
    }
  }

  /**
   * Sonar submarine/depth sounder Ping
   */
  public playSonarPing(delaySeconds = 0, isEcho = false) {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime + delaySeconds;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isEcho ? 1750 : 2100, t);

    const vol = isEcho ? 0.25 : 0.45;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + (isEcho ? 0.25 : 0.35));

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.4);
  }

  /**
   * Thunder rumble sound
   */
  public playThunder() {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 1.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin(i / 100) * Math.exp(-i / (this.ctx.sampleRate * 0.8));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
  }
}

export const soundEngine = new SoundEngine();
