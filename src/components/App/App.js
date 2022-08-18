import { useState } from "react";

import Editor from "../Editor";
import Output from "../Output";

import "./App.css";

const App = () => {
  const [editorState, setEditorState] = useState({});

  return (
    <div className="App">
      <Editor editorState={editorState} setEditorState={setEditorState} />
      <Output editorState={editorState} />
    </div>
  );
};

export default App;
