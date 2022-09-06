import { useState } from "react";

import Editor from "components/Editor";
import Output from "components/Output";

import "./App.css";

const App = () => {
  const [sentencesWithIds, setSentencesWithIds] = useState([]);

  const changedSentences = sentencesWithIds.filter(
    (sentence) => sentence.isDirty
  );

  return (
    <main className="App">
      <Editor
        sentencesWithIds={sentencesWithIds}
        setSentencesWithIds={setSentencesWithIds}
      />
      <Output
        changedSentences={changedSentences}
        sentencesWithIds={sentencesWithIds}
      />
    </main>
  );
};

export default App;
