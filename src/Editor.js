import { useState } from "react";

import "./Editor.css";

const Editor = () => {
  const [editorText, setEditorText] = useState(
    "This is a sentence. This is another."
  );

  return <div className="Editor">{editorText}</div>;
};

export default Editor;
