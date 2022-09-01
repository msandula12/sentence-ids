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
  const newSentences = sentencize(editorText);

  return updateSentences(previousSentences, newSentences, offset);
}

export function updateSentences(previousSentences, newSentences, offset) {
  if (isEmpty(previousSentences)) {
    return newSentences;
  }

  const indexOfChangedSentence = newSentences.findIndex((sentence) => {
    const start = sentence.offset;
    const end = start + sentence.length;
    return start <= offset && offset <= end;
  });

  const previousSentence = previousSentences[indexOfChangedSentence];
  const currentSentence = newSentences[indexOfChangedSentence];

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

  const sentencesAfterChange = newSentences
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

  return [...sentencesBeforeChange, changedSentence, ...sentencesAfterChange];
}
