import Editor from "../Editor";
import Output from "../Output";

import "./App.css";

const INITIAL_STATE = {
  0: {
    id: "2cSbOiapgN7P",
    length: 19,
    offset: 0,
    sentence: "This is a sentence.",
    updatable: false,
  },
  19: {
    id: "X6007NmLHNSf",
    length: 17,
    offset: 19,
    sentence: " This is another.",
    updatable: false,
  },
};

const App = () => {
  return (
    <div className="App">
      <Editor />
      <Output editorState={INITIAL_STATE} />
    </div>
  );
};

export default App;
