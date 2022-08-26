import { useState } from "react";
import { createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";

import "./Editor.css";

import {
  getCurrentOffset,
  getCurrentOperation,
  getEditorText,
} from "../../helpers/editor";
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
    const editorText = getEditorText(editor);
    const offset = getCurrentOffset(editor);
    const operation = getCurrentOperation(editor);

    if (operation.type === "insert_text") {
      console.log("offset: ", offset);
    } else if (operation.type === "remove_text") {
      // TODO
    }

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
