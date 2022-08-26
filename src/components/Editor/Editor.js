import { useState } from "react";
import { createEditor, Editor as SlateEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";

import "./Editor.css";

import sentencize from "../../helpers/sentencize";

const INITIAL_VALUE = [
  {
    children: [{ text: "" }],
    type: "paragraph",
  },
];

const Editor = ({ sentencesWithIds, setSentencesWithIds }) => {
  // Editor
  const [editor] = useState(() => withReact(createEditor()));

  const updateSentencesWithIds = () => {
    const editorText = SlateEditor.string(editor, []);
    setSentencesWithIds(sentencize(editorText));
  };

  return (
    <Slate
      editor={editor}
      onChange={updateSentencesWithIds}
      value={INITIAL_VALUE}
    >
      <Editable className="Editor" />
    </Slate>
  );
};

export default Editor;
