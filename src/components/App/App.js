import { useState } from "react";

import Editor from "components/Editor";
import Output from "components/Output";

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
