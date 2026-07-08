import { useCallback, useRef, useState } from 'react';
import { playPitchedPattern, stopPitchedPattern, previewNotes } from '../engines/synthEngine';

// Pitched counterpart to useAudio — same isPlaying/currentStep shape, for
// PianoRoll's chord/melody playback instead of drum samples.
export function useSynth() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const stopRef = useRef(false);

  const play = useCallback(async (pattern, blockTypes, { stepCount, bpm } = {}) => {
    stopRef.current = false;
    setIsPlaying(true);
    await playPitchedPattern(pattern, blockTypes, {
      stepCount,
      bpm,
      onStep: (s) => {
        if (!stopRef.current) setCurrentStep(s);
      },
    });
  }, []);

  const stop = useCallback(() => {
    stopRef.current = true;
    stopPitchedPattern();
    setIsPlaying(false);
    setCurrentStep(-1);
  }, []);

  const preview = useCallback((notes) => {
    previewNotes(notes);
  }, []);

  return { isPlaying, currentStep, play, stop, preview };
}
