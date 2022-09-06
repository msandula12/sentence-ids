import { useState } from "react";

import Editor from "components/Editor";
import Output from "components/Output";

import "./App.css";

const App = () => {
  const [sentencesWithIds, setSentencesWithIds] = useState([]);

  return (
    <main className="App">
      <Editor
        sentencesWithIds={sentencesWithIds}
        setSentencesWithIds={setSentencesWithIds}
      />
      <Output sentencesWithIds={sentencesWithIds} />
    </main>
  );
};

export default App;
