import { useEffect, useState } from "react";

import "./Editor.css";

import sentencize from "../../helpers/sentencize";

const supportedInputTypes = new Set([
  "deleteByCut",
  "deleteContentBackward",
  "deleteContentForward",
  "insertFromPaste",
  "insertLineBreak",
  "insertText",
]);

const Editor = ({ editorState, setEditorState }) => {
  // State
  const [end, setEnd] = useState(0);
  const [start, setStart] = useState(0);
  const [sentences, setSentences] = useState([]);

  // Effects
  useEffect(() => {
    sentences.forEach((sentence) => {
      const { offset } = sentence;
      sentence.updatable = false;
      if (!editorState[offset]) {
        setEditorState((currentState) => {
          return {
            ...currentState,
            [offset]: sentence,
          };
        });
      } else if (editorState[offset].updatable) {
        // Sentence already existed, but changed: Keep id
        sentence.id = editorState[offset].id;
        setEditorState((currentState) => {
          return {
            ...currentState,
            [offset]: sentence,
          };
        });
      }
    });
    Object.keys(editorState).forEach((sentenceStart) => {
      if (editorState[sentenceStart].updatable) {
        // Sentence was marked for update, but no update (changed too much to retain id): Delete it
        setEditorState((currentState) => {
          const copy = { ...currentState };
          delete copy[sentenceStart];
          return copy;
        });
      }
    });
  }, [editorState, sentences, setEditorState]);

  const setUpdatables = (startIndex, endIndex) => {
    Object.keys(editorState).forEach((sentenceStart) => {
      const sentenceEnd =
        sentenceStart + editorState[sentenceStart].sentence.length;
      if (sentenceEnd >= startIndex && sentenceStart < endIndex) {
        setEditorState((currentState) => {
          return {
            ...currentState,
            [sentenceStart]: {
              ...currentState[sentenceStart],
              updatable: true,
            },
          };
        });
      }
    });
  };

  const updateStateOffsets = (lengthChange, endIndex) => {
    const toUpdate = [];
    Object.keys(editorState).forEach((sentenceStart) => {
      if (sentenceStart > endIndex) {
        setEditorState((currentState) => {
          return {
            ...currentState,
            [sentenceStart]: {
              ...currentState[sentenceStart],
              offset: currentState[sentenceStart].offset + lengthChange,
            },
          };
        });
        toUpdate.push({
          oldOffset: sentenceStart,
          sentence: editorState[sentenceStart],
        });
      }
    });
    toUpdate.forEach((updatable) => {
      const { oldOffset, sentence } = updatable;
      console.log(
        `Moving sentence "${sentence.sentence}" from offset ${oldOffset} to offset ${sentence.offset}`
      );
      setEditorState((currentState) => {
        const copy = { ...currentState };
        delete copy[oldOffset];
        return {
          ...copy,
          [sentence.offset]: sentence,
        };
      });
    });
  };

  const onChange = ({ end, start, text, type }) => {
    if (!supportedInputTypes.has(type)) {
      console.warn(
        `Unsupported input type: "${type}", attempting to proceed...`
      );
    }
    if (type === "deleteContentBackward") {
      let modifiedEnd = end;
      let modifiedStart = start;
      let deleteLength = modifiedEnd - start;
      if (deleteLength === 0) {
        // Wasn't a selection, just a delete
        deleteLength = 1;
        // Backward deletion, extend start
        modifiedStart -= 1;
        // Handle sentence fusion
        modifiedEnd += 1;
      }
      const lengthChange = -deleteLength;
      updateStateOffsets(lengthChange, modifiedEnd);
      setUpdatables(modifiedStart, modifiedEnd);
    } else if (type === "deleteContentForward") {
      let modifiedEnd = end;
      let deleteLength = modifiedEnd - start;
      if (deleteLength === 0) {
        // Wasn't a selection, just a delete
        deleteLength = 1;
        // Forward deletion, extend end
        modifiedEnd += 1;
        // Handle sentence fusion
        modifiedEnd += 1;
      }
      const lengthChange = -deleteLength;
      updateStateOffsets(lengthChange, modifiedEnd);
      setUpdatables(start, modifiedEnd);
    } else if (type === "insertLineBreak") {
      const insertLength = 1;
      const deleteLength = end - start;
      const lengthChange = insertLength - deleteLength;
      updateStateOffsets(lengthChange, end);
      setUpdatables(start, end + 1); // +1 so we update the next sentence
    } else {
      const insertLength = text ? text.length : 0;
      const deleteLength = end - start;
      const lengthChange = insertLength - deleteLength;
      updateStateOffsets(lengthChange, end);
      setUpdatables(
        start,
        end + 1 // +1 so we update the next sentence
      );
    }
  };

  const handleBeforeInput = () => {
    const { anchorOffset, focusOffset } = document.getSelection();
    setStart(anchorOffset);
    setEnd(focusOffset);
  };

  const handleInput = ({
    nativeEvent: { data: text, inputType: type },
    target: { textContent },
  }) => {
    const inputEvent = {
      end,
      start,
      text,
      type,
    };
    const currentSentences = sentencize(textContent);
    setSentences(currentSentences);
    onChange(inputEvent);
  };

  return (
    <div
      className="Editor"
      contentEditable
      onBeforeInput={handleBeforeInput}
      onInput={handleInput}
    />
  );
};

export default Editor;
