import {
  describe,
  expect,
  it,
  vi
} from 'vitest';

import {
  act,
  renderHook,
} from '@testing-library/react';

import { useSpeech } from '../lib/useSpeech';

// headless browser used by vitest doesn't have speechSynthesis api (window.speechSynthesis === undefined)
vi.mock('../lib/speech', () => ({  // this mocks out a node module
  default: vi.fn(), // Mock a default export to make this a valid module
  createSpeechEngine: vi.fn(() => {}) // mocks the actual func we're using with fake data we defined in this test
}));

describe("useSpeech Test Suite", () => {
  it("should return current sentence idx and current word range as well as playback state", () => {
    const sentences = ["This is a sentence.", "This is another sentence."];
    const { result } = renderHook(() => useSpeech(sentences));
    expect(result.current.currentSentenceIdx).toBe(0);
    expect(result.current.currentWordRange).toEqual([0, 0]);
    expect(result.current.playbackState).toBe("paused");
  });
});
