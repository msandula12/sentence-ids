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
    console.log(`setUpdatables range: ${startIndex}-${endIndex}`);
    for (let key in editorState) {
      const sentenceStart = key;
      const sentenceEnd = key + editorState[key].sentence.length;
      if (sentenceEnd >= startIndex && sentenceStart < endIndex) {
        setEditorState((currentState) => {
          return {
            ...currentState,
            [key]: {
              ...currentState[key],
              updatable: true,
            },
          };
        });
      }
    }
  };

  const updateStateOffsets = (lengthChange, endIndex) => {
    console.log("lengthChange: ", lengthChange);
    console.log("endIndex: ", endIndex);
    const toUpdate = [];
    for (let key in editorState) {
      if (key > endIndex) {
        setEditorState((currentState) => {
          return {
            ...currentState,
            [key]: {
              ...currentState[key],
              offset: currentState[key].offset + lengthChange,
            },
          };
        });
        toUpdate.push({
          oldOffset: key,
          sentence: editorState[key],
        });
      }
    }
    for (let i = 0; i < toUpdate.length; i++) {
      const updatable = toUpdate[i];
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
    }
  };

  const onChange = (diffEvent) => {
    console.log("onChange: ", diffEvent);
    const supportedInputTypes = [
      "insertText",
      "insertFromPaste",
      "deleteByCut",
      "deleteContentBackward",
      "deleteContentForward",
      "insertLineBreak",
    ];
    if (!supportedInputTypes.includes(diffEvent.type)) {
      console.warn(
        `Unsupported input type: "${diffEvent.type}", attempting to proceed...`
      );
    }
    if (diffEvent.type === "deleteContentBackward") {
      let deleteLength = diffEvent.end - diffEvent.start;
      if (deleteLength === 0) {
        // Wasn't a selection, just a delete
        deleteLength = 1;
        // Backward deletion, extend start
        diffEvent.start -= 1;
        // Handle sentence fusion
        diffEvent.end += 1;
      }
      const lengthChange = -deleteLength;
      updateStateOffsets(lengthChange, diffEvent.end);
      setUpdatables(diffEvent.start, diffEvent.end);
    } else if (diffEvent.type === "deleteContentForward") {
      let deleteLength = diffEvent.end - diffEvent.start;
      if (deleteLength === 0) {
        // Wasn't a selection, just a delete
        deleteLength = 1;
        // Forward deletion, extend end
        diffEvent.end += 1;
        // Handle sentence fusion
        diffEvent.end += 1;
      }
      const lengthChange = -deleteLength;
      updateStateOffsets(lengthChange, diffEvent.end);
      setUpdatables(diffEvent.start, diffEvent.end);
    } else if (diffEvent.type === "insertLineBreak") {
      const insertLength = 1;
      const deleteLength = diffEvent.end - diffEvent.start;
      const lengthChange = insertLength - deleteLength;
      updateStateOffsets(lengthChange, diffEvent.end);
      setUpdatables(diffEvent.start, diffEvent.end + 1); // +1 so we update the next sentence
    } else {
      const insertLength = diffEvent.text ? diffEvent.text.length : 0;
      const deleteLength = diffEvent.end - diffEvent.start;
      const lengthChange = insertLength - deleteLength;
      updateStateOffsets(lengthChange, diffEvent.end);
      setUpdatables(
        diffEvent.start,
        diffEvent.end + 1 // +1 so we update the next sentence
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
    const diffEvent = {
      end,
      start,
      text,
      type,
    };
    const currentSentences = sentencize(textContent);
    setSentences(currentSentences);
    onChange(diffEvent);
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
