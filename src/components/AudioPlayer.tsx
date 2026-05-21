import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';

interface AudioPlayerProps {
  trackId: string;
  isPlaying: boolean;
  onTogglePlay: (play: boolean) => void;
}

export default function AudioPlayer({ trackId, isPlaying, onTogglePlay }: AudioPlayerProps) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeNodesRef = useRef<AudioNode[]>([]);
  const currentStepRef = useRef<number>(0);

  // Track state of initialization
  const [synthLabel, setSynthLabel] = useState('Cozy Lofi Lullaby');

  // Chords data (Freq in Hz)
  // Cmaj9, Am9, Fmaj9, G7sus
  const chords: { [key: string]: number[][] } = {
    'lofi-romance': [
      [130.81, 196.00, 261.63, 329.63, 392.00, 493.88], // Cmaj9 (C3, G3, C4, E4, G4, B4)
      [110.00, 164.81, 220.00, 261.63, 329.63, 392.00], // Am9 (A2, E3, A3, C4, E4, G4)
      [87.31, 130.81, 174.61, 218.27, 261.63, 329.63],  // Fmaj9 (F2, C3, F3, A3, C4, E4)
      [98.00, 146.83, 196.00, 246.94, 293.66, 349.23]   // G9 (G2, D3, G3, B3, D4, F4)
    ],
    'music-box': [
      [261.63, 329.63, 392.00, 523.25], // C4, E4, G4, C5
      [349.23, 440.00, 523.25, 698.46], // F4, A4, C5, F5
      [392.00, 493.88, 587.33, 783.99], // G4, B4, D5, G5
      [261.63, 329.63, 392.00, 523.25]  // C4, E4, G4, C5
    ]
  };

  // Birthday melody: Happy Birthday
  // Notes: C4, C4, D4, C4, F4, E4 / C4, C4, D4, C4, G4, F4 / C4, C4, C5, A4, F4, E4, D4 / Bb4, Bb4, A4, F4, G4, F4
  const birthdayMelody = [
    261.63, 261.63, 293.66, 261.63, 349.23, 329.63, 0,
    261.63, 261.63, 293.66, 261.63, 392.00, 349.23, 0,
    261.63, 261.63, 523.25, 440.00, 349.23, 329.63, 293.66,
    466.16, 466.16, 440.00, 349.23, 392.00, 349.23, 0
  ];

  // Cozy drum beat pattern
  // Step: 0 to 15. bpm = 85. beatDuration = 0.176s.
  const playBeat = (time: number, step: number) => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;

    // Soft kick drum on beat 0 and 8
    if (step === 0 || step === 8 || step === 6 || step === 14) {
      const kickOsc = ctx.createOscillator();
      const kickGain = ctx.createGain();
      kickOsc.connect(kickGain);
      kickGain.connect(masterGainRef.current);

      kickOsc.frequency.setValueAtTime(110, time);
      kickOsc.frequency.exponentialRampToValueAtTime(45, time + 0.15);

      kickGain.gain.setValueAtTime(0.3, time);
      kickGain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

      kickOsc.start(time);
      kickOsc.stop(time + 0.16);
      activeNodesRef.current.push(kickOsc, kickGain);
    }

    // Soft rim-shot or snap on 4 and 12
    if (step === 4 || step === 12) {
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      snapOsc.type = 'triangle';
      snapOsc.connect(snapGain);
      snapGain.connect(masterGainRef.current);

      snapOsc.frequency.setValueAtTime(900, time);
      snapOsc.frequency.linearRampToValueAtTime(500, time + 0.04);

      snapGain.gain.setValueAtTime(0.08, time);
      snapGain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

      snapOsc.start(time);
      snapOsc.stop(time + 0.05);
      activeNodesRef.current.push(snapOsc, snapGain);
    }

    // Cozy hi-hat / shaker tick on even steps
    if (step % 2 === 0) {
      // White noise hi-hat synthesized
      const bufferSize = ctx.sampleRate * 0.03; // 30ms of noise
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = buffer;

      // Filter to make hi-hat sweet & high-pass
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(8000, time);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(step % 4 === 0 ? 0.012 : 0.006, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.025);

      noiseNode.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(masterGainRef.current);

      noiseNode.start(time);
      noiseNode.stop(time + 0.03);
      activeNodesRef.current.push(noiseNode, filter, noiseGain);
    }
  };

  const playChord = (time: number, chordIndex: number) => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;
    const selectedChordProgression = chords['lofi-romance'];
    const currentChordFreqs = selectedChordProgression[chordIndex % selectedChordProgression.length];

    currentChordFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Soft warm cuddly triangle waves (rhodes style piano)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      // Low-pass filter to sound muffled and dreamy
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450 + Math.sin(time) * 100, time);
      filter.Q.setValueAtTime(1, time);

      // Arpeggiate chord notes slightly for cozy organic feel
      const delay = idx * 0.075;

      // Lush envelope: slow attack, long release
      gainNode.gain.setValueAtTime(0, time + delay);
      gainNode.gain.linearRampToValueAtTime(0.08, time + delay + 0.15);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + delay + 2.8);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(masterGainRef.current!);

      osc.start(time + delay);
      osc.stop(time + delay + 3);
      activeNodesRef.current.push(osc, filter, gainNode);
    });
  };

  const playMusicBoxBell = (time: number, beatIndex: number) => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;

    // Play happy birthday melody note
    const noteFreq = birthdayMelody[beatIndex % birthdayMelody.length];
    if (noteFreq === 0) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Pure beautiful sine-wave resembling chime bells
    osc.type = 'sine';
    osc.frequency.setValueAtTime(noteFreq, time);

    // Chime Envelope: Instant attack, long decaying bell sound
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.07, time + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + 1.2);

    // Add high-pass filter for metallic air
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(500, time);

    osc.connect(hp);
    hp.connect(gainNode);
    gainNode.connect(masterGainRef.current);

    osc.start(time);
    osc.stop(time + 1.3);
    activeNodesRef.current.push(osc, hp, gainNode);
  };

  const startScheduler = () => {
    if (!audioCtxRef.current) return;

    // Tempo setup: 80 BPM
    const bpm = 80;
    const stepDuration = 60 / bpm / 2; // 1/8 note duration = ~0.375s
    let nextNoteTime = audioCtxRef.current.currentTime + 0.1;

    const scheduleNextBeats = () => {
      const ctx = audioCtxRef.current;
      if (!ctx || ctx.state === 'suspended') return;

      while (nextNoteTime < ctx.currentTime + 0.3) {
        const currentStep = currentStepRef.current;

        // Sequence beat drums in any case
        playBeat(nextNoteTime, currentStep % 16);

        // Sequence according to track selected
        if (trackId === 'lofi-romance') {
          // Play chords on bar start (every 8 steps/4 beats)
          if (currentStep % 8 === 0) {
            playChord(nextNoteTime, Math.floor(currentStep / 8));
          }
          // Soft music box backing embellishments
          if (currentStep % 4 === 2) {
            playMusicBoxBell(nextNoteTime, Math.floor(currentStep / 3));
          }
        } else {
          // Pure Music Box Birthday theme
          // Play melody notes on alternating eighth notes
          if (currentStep % 2 === 0) {
            playMusicBoxBell(nextNoteTime, Math.floor(currentStep / 2));
          }
          // Soft backing drone chord
          if (currentStep % 16 === 0) {
            const index = Math.floor(currentStep / 16);
            const progressionNotes = chords['music-box'][index % chords['music-box'].length];
            progressionNotes.forEach((freq) => {
              const droneOsc = ctx.createOscillator();
              const droneGain = ctx.createGain();
              droneOsc.type = 'triangle';
              droneOsc.frequency.setValueAtTime(freq / 2, nextNoteTime); // lower octave
              droneGain.gain.setValueAtTime(0, nextNoteTime);
              droneGain.gain.linearRampToValueAtTime(0.015, nextNoteTime + 0.8);
              droneGain.gain.exponentialRampToValueAtTime(0.001, nextNoteTime + 5.5);
              
              droneOsc.connect(droneGain);
              droneGain.connect(masterGainRef.current!);
              droneOsc.start(nextNoteTime);
              droneOsc.stop(nextNoteTime + 6.0);
              activeNodesRef.current.push(droneOsc, droneGain);
            });
          }
        }

        nextNoteTime += stepDuration;
        currentStepRef.current += 1;
      }
    };

    // Run scheduler loop
    intervalRef.current = window.setInterval(scheduleNextBeats, 150);
  };

  const stopAudio = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Fade out master gain quickly to avoid pops, then dispose active synth oscillations
    if (masterGainRef.current && audioCtxRef.current) {
      const time = audioCtxRef.current.currentTime;
      masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, time);
      masterGainRef.current.gain.linearRampToValueAtTime(0.001, time + 0.1);
    }

    setTimeout(() => {
      activeNodesRef.current.forEach((node) => {
        try {
          (node as any).stop?.();
          node.disconnect();
        } catch (e) {}
      });
      activeNodesRef.current = [];
    }, 150);
  };

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      masterGainRef.current = audioCtxRef.current.createGain();

      // Ambient master volume setting
      masterGainRef.current.gain.setValueAtTime(0.25, audioCtxRef.current.currentTime);
      masterGainRef.current.connect(audioCtxRef.current.destination);
    }

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  useEffect(() => {
    setSynthLabel(trackId === 'lofi-romance' ? 'Cozy Sunset Lofi' : 'Aesthetic Melody Bell');
  }, [trackId]);

  useEffect(() => {
    if (isPlaying) {
      try {
        initAudio();
        // Ensure master volume reset
        if (masterGainRef.current && audioCtxRef.current) {
          masterGainRef.current.gain.setValueAtTime(0.22, audioCtxRef.current.currentTime);
        }
        startScheduler();
      } catch (e) {
        console.warn('AudioContext failed to start', e);
      }
    } else {
      stopAudio();
    }

    return () => {
      stopAudio();
    };
  }, [isPlaying, trackId]);

  const handleToggle = () => {
    if (!isPlaying) {
      // Initialize audio on click
      try {
        initAudio();
      } catch (e) {}
    }
    onTogglePlay(!isPlaying);
  };

  return null;
}
export const SOUNDS = [
  { id: 'lofi-romance', name: 'Cozy Lofi Sunset' },
  { id: 'music-box', name: 'Delicate Music Box' }
];
