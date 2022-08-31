import { useState } from "react";
import { createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";

import "./Editor.css";

import { getCurrentOperation, getUpdatedSentences } from "../../helpers/editor";

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
    const operation = getCurrentOperation(editor);
    if (operation.type === "insert_text") {
      const updatedSentences = getUpdatedSentences(editor, sentencesWithIds);
      setSentencesWithIds(updatedSentences);
    } else if (operation.type === "remove_text") {
      const updatedSentences = getUpdatedSentences(editor, sentencesWithIds);
      setSentencesWithIds(updatedSentences);
    }
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
