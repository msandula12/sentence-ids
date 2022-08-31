import { useState } from "react";
import { createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";

import "./Editor.css";

import {
  getCurrentOffset,
  getCurrentOperation,
  getEditorText,
} from "../../helpers/editor";
import { sentencize } from "../../helpers/sentencize";
import { isEmpty } from "../../utils";

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
    const newSentencesWithIds = sentencize(editorText);
    if (operation.type === "insert_text") {
      console.log("%c INSERT TEXT", "color:green");
      console.log("offset: ", offset);
      console.log("sentences (OLD): ", sentencesWithIds);
      console.log("sentences (NEW): ", newSentencesWithIds);

      setSentencesWithIds((previousSentencesWithIds) => {
        if (isEmpty(previousSentencesWithIds)) {
          return newSentencesWithIds;
        }

        const indexOfChangedSentence = newSentencesWithIds.findIndex(
          (sentence) => {
            const start = sentence.offset;
            const end = start + sentence.length;
            return start <= offset && offset <= end;
          }
        );

        const previousSentence =
          previousSentencesWithIds[indexOfChangedSentence];
        const currentSentence = newSentencesWithIds[indexOfChangedSentence];

        const sentencesBeforeChange = previousSentencesWithIds.slice(
          0,
          indexOfChangedSentence
        );

        const changedSentence = previousSentence
          ? {
              ...currentSentence,
              id: previousSentence.id,
            }
          : currentSentence;

        const sentencesAfterChange = newSentencesWithIds
          .slice(indexOfChangedSentence + 1)
          .map((sentence, i) => {
            const previous =
              previousSentencesWithIds[indexOfChangedSentence + 1 + i];
            return previousSentence
              ? {
                  ...sentence,
                  id: previous.id,
                }
              : sentence;
          });

        console.log("indexOfChangedSentence: ", indexOfChangedSentence);
        console.log("previousSentence: ", previousSentence);
        console.log("currentSentence: ", currentSentence);
        console.log("sentencesBeforeChange: ", sentencesBeforeChange);
        console.log("changedSentence: ", changedSentence);
        console.log("sentencesAfterChange: ", sentencesAfterChange);

        return [
          ...sentencesBeforeChange,
          changedSentence,
          ...sentencesAfterChange,
        ];
      });
    } else if (operation.type === "remove_text") {
      console.log("offset: ", offset);
      setSentencesWithIds(newSentencesWithIds);
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
