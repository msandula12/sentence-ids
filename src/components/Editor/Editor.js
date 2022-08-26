import { useState } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";

import "./Editor.css";

// import sentencize from "../../helpers/sentencize";

const INITIAL_VALUE = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const Editor = ({ editorState, setEditorState }) => {
  // Editor
  const [editor] = useState(() => withReact(createEditor()));

  return (
    <Slate editor={editor} value={INITIAL_VALUE}>
      <Editable className="Editor" />
    </Slate>
  );
};

export default Editor;
