import { useCallback, useState } from "react";
import { createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";

import "./Editor.css";

import { getCurrentOperation, getUpdatedSentences } from "helpers/editor";
import { debounce } from "utils";

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

  const resetIsDirty = () => {
    console.log(`%cRESET IS DIRTY`, "color:blue");
    setSentencesWithIds((previousSentences) =>
      previousSentences.map((sentence) => ({
        ...sentence,
        isDirty: false,
      }))
    );
  };

  const resetIsDirtyDebounced = debounce(resetIsDirty, 1500);

  const updateSentencesWithIds = () => {
    const { type } = getCurrentOperation(editor);
    if (updatableOperations.has(type)) {
      const updatedSentences = getUpdatedSentences(editor, sentencesWithIds);
      setSentencesWithIds(updatedSentences);
      resetIsDirtyDebounced();
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
