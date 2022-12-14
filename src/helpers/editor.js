import { nanoid } from "nanoid";
import { Editor, Element, Node } from "slate";
import tokenizer from "sbd";

import { isEmptyList, isEqualBy } from "utils";

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

function getLengthOfUpdate(editor) {
  const { text, type } = getCurrentOperation(editor);
  let lengthOfUpdate = 0;
  if (type === "insert_text") {
    lengthOfUpdate = text.length;
  } else if (type === "remove_text") {
    lengthOfUpdate = -text.length;
  }
  return lengthOfUpdate;
}

export function getUpdatedSentences(editor, previousSentences) {
  const newSentences = sentencize(editor);
  const offset = getCurrentOffset(editor);
  const lengthOfUpdate = getLengthOfUpdate(editor);

  return updateSentences(
    previousSentences,
    newSentences,
    offset,
    lengthOfUpdate
  );
}

export function updateSentences(
  previousSentences,
  newSentences,
  offset,
  lengthOfUpdate = 0
) {
  if (isEmptyList(previousSentences) || isEmptyList(newSentences)) {
    return newSentences.map((sentence) => ({
      ...sentence,
      isDirty: true,
    }));
  }

  let indexOfChange = -1;

  for (
    let i = 0;
    i < Math.max(previousSentences.length, newSentences.length);
    i++
  ) {
    const previous = previousSentences[i];
    const current = newSentences[i];
    if (previous && current) {
      if (isEqualBy(previous, current, "length", "offset", "sentence")) {
        indexOfChange = i;
      } else {
        if (indexOfChange === -1) {
          indexOfChange = 0;
        } else {
          indexOfChange++;
        }
        break;
      }
    } else {
      indexOfChange = i;
      break;
    }
  }

  const untouchedSentences = previousSentences.slice(0, indexOfChange);
  let previousSentencesAfterUpdate = previousSentences.slice(indexOfChange);

  const touchedSentences = newSentences.slice(indexOfChange).map((sentence) => {
    // The sentence didn't change, but it was shifted so return the previous sentence with the new offset
    const shiftedSentence = previousSentencesAfterUpdate.find((s) => {
      return (
        isEqualBy(s, sentence, "length", "text") &&
        s.offset === sentence.offset - lengthOfUpdate
      );
    });

    if (shiftedSentence) {
      // Remove sentence from list so it isn't found again
      previousSentencesAfterUpdate = previousSentencesAfterUpdate.filter(
        (s) => s.id !== shiftedSentence.id
      );
      return {
        ...shiftedSentence,
        offset: sentence.offset,
      };
    }

    // The sentence changed so return the new sentence with the previous ID
    const touchedSentence = previousSentencesAfterUpdate.find((s) => {
      const start = s.offset;
      const end = start + sentence.length;
      return start <= offset - lengthOfUpdate && offset <= end;
    });

    if (touchedSentence) {
      // Remove sentence from list so it isn't found again
      previousSentencesAfterUpdate = previousSentencesAfterUpdate.filter(
        (s) => s.id !== touchedSentence.id
      );
      return {
        ...sentence,
        id: touchedSentence.id,
        isDirty: true,
      };
    }

    // Sentence is new, so return as-is
    return {
      ...sentence,
      isDirty: true,
    };
  });

  return [...untouchedSentences, ...touchedSentences];
}

function sentencize(editor) {
  let offset = 0;

  const sentences = getAllSentencesInEditor(editor);

  return sentences.map((sentence) => {
    const sentencized = {
      id: nanoid(),
      isDirty: false,
      length: sentence.length,
      offset,
      sentence,
    };
    offset += sentence.length;
    return sentencized;
  });
}
