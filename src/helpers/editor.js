import { nanoid } from "nanoid";
import { Editor, Element, Node } from "slate";
import tokenizer from "sbd";

import { isEmptyList } from "utils";

/**
 * Overrides sbd's default options.
 * https://github.com/Tessmore/sbd
 */
const TOKENIZER_OPTIONS = {
  preserve_whitespace: true,
};

function convertNodesIntoBlocks(nodes) {
  return nodes.map((el, blockIndex) => {
    if (Element.isElement(el)) {
      return el.children
        .map((child) =>
          tokenizer
            .sentences(Node.string(child), TOKENIZER_OPTIONS)
            .map((sentence) => ({
              blockIndex,
              sentence,
            }))
        )
        .flat();
    }
    return tokenizer
      .sentences(Node.string(el), TOKENIZER_OPTIONS)
      .map((sentence) => ({
        blockIndex,
        sentence,
      }));
  });
}

function getAllSentencesInEditor(editor) {
  const blocks = convertNodesIntoBlocks(editor.children);
  return blocks.flat().map((block) => block.sentence);
}

function getCurrentOffset(editor) {
  return getEditorTextUpToSelection(editor).length;
}

export function getCurrentOperation(editor) {
  return editor.operations[editor.operations.length - 1];
}

function getEditorTextUpToSelection(editor) {
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
  const newSentences = sentencize(editor);
  const offset = getCurrentOffset(editor);

  return updateSentences(previousSentences, newSentences, offset);
}

export function updateSentences(previousSentences, newSentences, offset) {
  if (isEmptyList(previousSentences) || isEmptyList(newSentences)) {
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

function sentencize(editor) {
  let offset = 0;

  const sentences = getAllSentencesInEditor(editor);

  return sentences.map((sentence) => {
    const sentencized = {
      id: nanoid(),
      length: sentence.length,
      offset,
      sentence,
    };
    offset += sentence.length;
    return sentencized;
  });
}
