import { Editor } from "slate";

import { sentencize } from "./sentencize";
import { isEmpty } from "../utils";

export function getCurrentOffset(editor) {
  return getEditorTextUpToSelection(editor).length;
}

export function getCurrentOperation(editor) {
  return editor.operations[editor.operations.length - 1];
}

export function getEditorText(editor) {
  return Editor.string(editor, []);
}

export function getEditorTextUpToSelection(editor) {
  if (!editor.selection) return "";
  return Editor.string(editor, {
    anchor: {
      offset: 0,
      path: [0, 0],
    },
    focus: editor.selection.focus,
  });
}

export function getUpdatedSentences(editor, previousSentences) {
  const editorText = getEditorText(editor);
  const offset = getCurrentOffset(editor);
  const newSentencesWithIds = sentencize(editorText);

  if (isEmpty(previousSentences)) {
    return newSentencesWithIds;
  }

  const indexOfChangedSentence = newSentencesWithIds.findIndex((sentence) => {
    const start = sentence.offset;
    const end = start + sentence.length;
    return start <= offset && offset <= end;
  });

  const previousSentence = previousSentences[indexOfChangedSentence];
  const currentSentence = newSentencesWithIds[indexOfChangedSentence];

  const sentencesBeforeChange = previousSentences.slice(
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
      const previous = previousSentences[indexOfChangedSentence + 1 + i];
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

  return [...sentencesBeforeChange, changedSentence, ...sentencesAfterChange];
}
