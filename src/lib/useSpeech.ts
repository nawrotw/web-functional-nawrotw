import { useState, useRef } from 'react';

import { PlayingState, createSpeechEngine, SpeechEngine } from './speech';

/*
  @description
  Implement a custom useSpeech hook that uses a speech engine defined in 'speech.ts'
  to play the sentences that have been fetched and parsed previously.
  
  This hook should return react friendly controls for playing, and pausing audio as well as provide information about
  the currently read word and sentence
*/
const useSpeech = (sentences: Array<string>) => {
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [currentWordRange, setCurrentWordRange] = useState<[number, number]>([0, 0]);

  const [playbackState, setPlaybackState] = useState<PlayingState>("paused");

  // this is a small trick to have proper dependencies
  // this is equivalent to react useEffectEvent hook that lets you extract non-reactive logic into an Effect Event
  // https://react.dev/reference/react/experimental_useEffectEvent
  const onEndRef = useRef(() => {});
  onEndRef.current = () => {
    if (currentSentenceIdx === sentences.length - 1) {
      // No more sentences to read.
      setCurrentSentenceIdx(0);
      setCurrentWordRange([0, 0]);
      return;
    }
    const nextIndex = currentSentenceIdx + 1;
    speechEngine.load(sentences[nextIndex]);
    speechEngine.play();
    setCurrentSentenceIdx(nextIndex);
  }

  const speechEngine: SpeechEngine = createSpeechEngine({
    onBoundary: (e: SpeechSynthesisEvent) => {
      setCurrentWordRange([e.charIndex, e.charIndex + e.charLength]);
    },
    onEnd: () => onEndRef.current(),
    onStateUpdate: setPlaybackState,
  });

  const reset = () => {
    if (playbackState === 'playing') {
      speechEngine.cancel();
    }
    setCurrentSentenceIdx(0);
    setCurrentWordRange([0, 0]);
  }

  const play = async () => {
    speechEngine.load(sentences[currentSentenceIdx]);
    speechEngine.play();
  };

  const pause = () => {
    speechEngine.pause();
    // setCurrentWordRange([0, 0]);
  };

  return {
    currentSentenceIdx,
    currentWordRange,
    playbackState,
    play,
    pause,
    reset,
  };
};

export { useSpeech };
