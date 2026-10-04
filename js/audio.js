/**
 * FocusFlow Web Audio API Sound Engine
 * Synthesizes ambient background sounds and notification chimes.
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.ambientGain = null;
        this.activeNoiseNode = null;
        this.activeOsc = null;
        this.currentAmbient = 'none';
        this.volume = 0.3;
        this.soundEnabled = true;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playChime(type = 'success') {
        if (!this.soundEnabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const masterGain = this.ctx.createGain();
        masterGain.gain.setValueAtTime(0.15, now);
        masterGain.connect(this.ctx.destination);

        if (type === 'success') {
            // Uplifting 3-note major chord (C5, E5, G5)
            const freqs = [523.25, 659.25, 783.99];
            freqs.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const noteGain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + idx * 0.08);

                noteGain.gain.setValueAtTime(0.01, now + idx * 0.08);
                noteGain.gain.exponentialRampToValueAtTime(0.2, now + idx * 0.08 + 0.04);
                noteGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.6);

                osc.connect(noteGain);
                noteGain.connect(masterGain);

                osc.start(now + idx * 0.08);
                osc.stop(now + idx * 0.08 + 0.65);
            });
        } else if (type === 'timerComplete') {
            // Calm zen gong/bell sequence
            const bellFreqs = [440, 880, 1320];
            bellFreqs.forEach((freq) => {
                const osc = this.ctx.createOscillator();
                const noteGain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);

                noteGain.gain.setValueAtTime(0.2, now);
                noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

                osc.connect(noteGain);
                noteGain.connect(masterGain);

                osc.start(now);
                osc.stop(now + 2.5);
            });
        } else if (type === 'click') {
            const osc = this.ctx.createOscillator();
            const noteGain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);

            noteGain.gain.setValueAtTime(0.05, now);
            noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

            osc.connect(noteGain);
            noteGain.connect(masterGain);

            osc.start(now);
            osc.stop(now + 0.05);
        }
    }

    setAmbientSound(type, volume = 0.3) {
        this.init();
        if (!this.ctx) return;

        this.volume = parseFloat(volume);

        // Stop current nodes
        if (this.activeNoiseNode) {
            try {
                this.activeNoiseNode.stop();
                this.activeNoiseNode.disconnect();
            } catch (e) {}
            this.activeNoiseNode = null;
        }

        if (this.activeOsc) {
            try {
                this.activeOsc.stop();
                this.activeOsc.disconnect();
            } catch (e) {}
            this.activeOsc = null;
        }

        this.currentAmbient = type;
        if (type === 'none') return;

        if (type === 'focus') {
            // 432Hz sine tone
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(432, this.ctx.currentTime);
            gain.gain.setValueAtTime(this.volume * 0.15, this.ctx.currentTime);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            this.activeOsc = osc;
            this.ambientGain = gain;
            return;
        }

        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        if (type === 'white') {
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
        } else if (type === 'rain' || type === 'waves') {
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
            for (let i = 0; i < bufferSize; i++) {
                let white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
                b6 = white * 0.115926;
            }
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(this.volume * 0.2, this.ctx.currentTime);

        const filter = this.ctx.createBiquadFilter();
        filter.type = type === 'rain' ? 'lowpass' : (type === 'waves' ? 'bandpass' : 'lowpass');
        filter.frequency.setValueAtTime(type === 'rain' ? 1200 : (type === 'waves' ? 600 : 3000), this.ctx.currentTime);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        noise.start();
        this.activeNoiseNode = noise;
        this.ambientGain = gainNode;
    }

    setVolume(vol) {
        this.volume = parseFloat(vol);
        if (this.ambientGain && this.ctx) {
            this.ambientGain.gain.setValueAtTime(this.volume * 0.2, this.ctx.currentTime);
        }
    }
}

window.soundEngine = new SoundEngine();

