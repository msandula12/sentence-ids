import { useState } from "react";
import { createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";

import "./Editor.css";

import { getCurrentOperation, getUpdatedSentences } from "../../helpers/editor";

const updatableOperations = new Set([
  "insert_text",
  "merge_node",
  "remove_node",
  "remove_text",
  "split_node",
]);

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
    const { type } = getCurrentOperation(editor);
    if (updatableOperations.has(type)) {
      const updatedSentences = getUpdatedSentences(editor, sentencesWithIds);
      setSentencesWithIds(updatedSentences);
    } else {
      console.log(`"${type}" is not an updatable operation.`);
    }
  };

  return (
    <Slate
      editor={editor}
      onChange={updateSentencesWithIds}
      value={INITIAL_VALUE}
    >
      <Editable className="Editor" placeholder="Start typing here" />
    </Slate>
  );
};

export default Editor;
