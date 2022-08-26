import { useState } from "react";

import Editor from "../Editor";
import Output from "../Output";

import "./App.css";

const App = () => {
  const [sentencesWithIds, setSentencesWithIds] = useState([]);

  return (
    <div className="App">
      <Editor
        sentencesWithIds={sentencesWithIds}
        setSentencesWithIds={setSentencesWithIds}
      />
      <Output sentencesWithIds={sentencesWithIds} />
    </div>
  );
};

export default App;
