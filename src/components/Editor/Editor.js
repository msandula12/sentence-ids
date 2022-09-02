import { useCallback, useState } from "react";
import { createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";

import "./Editor.css";

import { getCurrentOperation, getUpdatedSentences } from "helpers/editor";

import DefaultElement from "./DefaultElement";

const updatableOperations = new Set([
  "insert_text",
  "merge_node",
  "remove_node",
  "remove_text",
  "split_node",
]);

const INITIAL_EDITOR_VALUE = [
  {
    children: [{ text: "" }],
    type: "paragraph",
  },
];

const Editor = ({ sentencesWithIds, setSentencesWithIds }) => {
  // Callbacks
  const renderElement = useCallback((props) => {
    return <DefaultElement {...props} />;
  }, []);

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
      value={INITIAL_EDITOR_VALUE}
    >
      <Editable
        className="Editor"
        placeholder="Start typing here"
        renderElement={renderElement}
        spellCheck={false}
      />
    </Slate>
  );
};

export default Editor;
