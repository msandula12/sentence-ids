import "./Editor.css";

import sentencize from "../../helpers/sentencize";

const Editor = ({ editorState, setEditorState }) => {
  const updateState = (sentences) => {
    for (let i = 0; i < sentences.length; i++) {
      let sentence = sentences[i];
      let offset = sentence.offset;
      sentence.updatable = false;
      if (!editorState[offset]) {
        setEditorState((currentState) => {
          return {
            ...currentState,
            [offset]: sentence,
          };
        });
      } else if (editorState[offset].updatable) {
        // sentence already existed but changed, keep id
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
        // sentence was marked for update but no update--changed too much to retain id
        // delete it
        setEditorState((currentState) => {
          const copy = { ...currentState };
          delete copy[key];
          return copy;
        });
      }
    }
  };

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
    let toUpdate = [];
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
      let updatable = toUpdate[i];
      let sentence = updatable.sentence;
      let oldOffset = updatable.oldOffset;
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
        // wasn't a selection, just a delete
        deleteLength = 1;
        // backward deletion, extend start
        diffEvent.start -= 1;
        // handle sentence fusion
        diffEvent.end += 1;
      }
      let lengthChange = -deleteLength;
      updateStateOffsets(lengthChange, diffEvent.end);
      setUpdatables(diffEvent.start, diffEvent.end);
    } else if (diffEvent.type === "deleteContentForward") {
      let deleteLength = diffEvent.end - diffEvent.start;
      if (deleteLength === 0) {
        // wasn't a selection, just a delete
        deleteLength = 1;
        // forward deletion, extend end
        diffEvent.end += 1;
        // handle sentence fusion
        diffEvent.end += 1;
      }
      let lengthChange = -deleteLength;
      updateStateOffsets(lengthChange, diffEvent.end);
      setUpdatables(diffEvent.start, diffEvent.end);
    } else if (diffEvent.type === "insertLineBreak") {
      let insertLength = 1;
      let deleteLength = diffEvent.end - diffEvent.start;
      let lengthChange = insertLength - deleteLength;
      updateStateOffsets(lengthChange, diffEvent.end);
      setUpdatables(diffEvent.start, diffEvent.end + 1); // +1 so we update the next sentence
    } else {
      let insertLength = diffEvent.text ? diffEvent.text.length : 0;
      let deleteLength = diffEvent.end - diffEvent.start;
      let lengthChange = insertLength - deleteLength;
      updateStateOffsets(lengthChange, diffEvent.end);
      setUpdatables(
        diffEvent.start,
        diffEvent.end + 1 // +1 so we update the next sentence
      );
    }
  };

  const handleInput = ({
    nativeEvent: { data: text, inputType: type },
    target: { textContent },
  }) => {
    const { anchorOffset: start, focusOffset: end } = document.getSelection();
    const diffEvent = {
      end,
      start,
      text,
      type,
    };
    const sentences = sentencize(textContent);

    console.log("diffEvent: ", diffEvent);
    console.log("sentences: ", sentences);

    onChange(diffEvent);
    updateState(sentences);
  };

  return (
    <div
      className="Editor"
      contentEditable
      onInput={handleInput}
      suppressContentEditableWarning
    />
  );
};

export default Editor;
