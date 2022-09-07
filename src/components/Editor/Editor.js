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

  const fakeApiCall = debounce(() => {
    console.log(`%cMAKE API CALL`, "color:blue");
    setSentencesWithIds((previousSentences) =>
      previousSentences.map((sentence) => ({
        ...sentence,
        isDirty: false,
      }))
    );
  }, 1500);

  const updateSentencesWithIds = () => {
    const { type } = getCurrentOperation(editor);
    if (updatableOperations.has(type)) {
      const updatedSentences = getUpdatedSentences(editor, sentencesWithIds);
      setSentencesWithIds(updatedSentences);
    } else {
      console.log(`"${type}" is not an updatable operation.`);
    }
  };

  const handleOnChange = () => {
    updateSentencesWithIds();
    fakeApiCall();
  };

  return (
    <Slate
      editor={editor}
      onChange={handleOnChange}
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
