import { useCallback, useRef, useState } from 'react';
import { playPattern, stopPattern, triggerSample } from '../engines/audioEngine';

// Small React wrapper around audioEngine so components get isPlaying /
// currentStep as state instead of talking to Tone.js directly.
export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const stopRef = useRef(false);

  const play = useCallback(async (pattern, { stepCount, bpm, loop = true } = {}) => {
    stopRef.current = false;
    setIsPlaying(true);
    await playPattern(pattern, {
      stepCount,
      bpm,
      onStep: (s) => {
        if (!stopRef.current) setCurrentStep(s);
      },
    });
    if (!loop) {
      // best-effort single pass stop; caller can also call stop() manually
    }
  }, []);

  const stop = useCallback(() => {
    stopRef.current = true;
    stopPattern();
    setIsPlaying(false);
    setCurrentStep(-1);
  }, []);

  const preview = useCallback((blockId) => {
    triggerSample(blockId);
  }, []);

  return { isPlaying, currentStep, play, stop, preview };
}
