import './App.css';

import { Controls } from './components/Controls';
import { useEffect, useState } from "react";
import { fetchContent, parseContentIntoSentences } from "./lib/content";
import { useSpeech } from "./lib/useSpeech";
import { CurrentlyReading } from "./components/CurrentlyReading";

function App() {
  const [sentences, setSentences] = useState<Array<string>>([]);
  const { play, pause, reset, playbackState, currentWordRange, currentSentenceIdx } = useSpeech(sentences);

  const loadSentences = async () => {
    const contentStr = await fetchContent();
    const sentences = parseContentIntoSentences(contentStr);
    reset();
    setSentences(sentences);
  }

  useEffect(() => {
    loadSentences();
  }, []);


  return (
    <div className="App">
      <div>
        <CurrentlyReading sentences={sentences} currentWordRange={currentWordRange} currentSentenceIdx={currentSentenceIdx}/>
      </div>
      <div>
        <Controls play={play} pause={pause} loadNewContent={loadSentences} state={playbackState}/>
      </div>
    </div>
  );
}

export default App;
