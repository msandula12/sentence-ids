import { useEffect, useState } from "react";

import "./Editor.css";

import sentencize from "../../helpers/sentencize";

const Editor = ({ editorState, setEditorState }) => {
  // State
  const [end, setEnd] = useState(0);
  const [start, setStart] = useState(0);
  const [sentences, setSentences] = useState([]);

  // Effects
  useEffect(() => {
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      const offset = sentence.offset;
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
    }
    for (let key in editorState) {
      if (editorState[key].updatable) {
        // Sentence was marked for update, but no update (changed too much to retain id): Delete it
        setEditorState((currentState) => {
          const copy = { ...currentState };
          delete copy[key];
          return copy;
        });
      }
    }
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

  const onChange = (inputEvent) => {
    const supportedInputTypes = [
      "insertText",
      "insertFromPaste",
      "deleteByCut",
      "deleteContentBackward",
      "deleteContentForward",
      "insertLineBreak",
    ];
    if (!supportedInputTypes.includes(inputEvent.type)) {
      console.warn(
        `Unsupported input type: "${inputEvent.type}", attempting to proceed...`
      );
    }
    if (inputEvent.type === "deleteContentBackward") {
      let deleteLength = inputEvent.end - inputEvent.start;
      if (deleteLength === 0) {
        // Wasn't a selection, just a delete
        deleteLength = 1;
        // Backward deletion, extend start
        inputEvent.start -= 1;
        // Handle sentence fusion
        inputEvent.end += 1;
      }
      const lengthChange = -deleteLength;
      updateStateOffsets(lengthChange, inputEvent.end);
      setUpdatables(inputEvent.start, inputEvent.end);
    } else if (inputEvent.type === "deleteContentForward") {
      let deleteLength = inputEvent.end - inputEvent.start;
      if (deleteLength === 0) {
        // Wasn't a selection, just a delete
        deleteLength = 1;
        // Forward deletion, extend end
        inputEvent.end += 1;
        // Handle sentence fusion
        inputEvent.end += 1;
      }
      const lengthChange = -deleteLength;
      updateStateOffsets(lengthChange, inputEvent.end);
      setUpdatables(inputEvent.start, inputEvent.end);
    } else if (inputEvent.type === "insertLineBreak") {
      const insertLength = 1;
      const deleteLength = inputEvent.end - inputEvent.start;
      const lengthChange = insertLength - deleteLength;
      updateStateOffsets(lengthChange, inputEvent.end);
      setUpdatables(inputEvent.start, inputEvent.end + 1); // +1 so we update the next sentence
    } else {
      const insertLength = inputEvent.text ? inputEvent.text.length : 0;
      const deleteLength = inputEvent.end - inputEvent.start;
      const lengthChange = insertLength - deleteLength;
      updateStateOffsets(lengthChange, inputEvent.end);
      setUpdatables(
        inputEvent.start,
        inputEvent.end + 1 // +1 so we update the next sentence
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
      suppressContentEditableWarning
    />
  );
};

export default Editor;
