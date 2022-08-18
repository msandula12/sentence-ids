import sentencize from "../../helpers/sentencize";

import "./Editor.css";

const INITIAL_TEXT = "This is a sentence. This is another.";

const Editor = () => {
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

    // onChange(diffEvent);
    // updateState(sentences);
    // displayState();
  };

  return (
    <div
      className="Editor"
      contentEditable
      onInput={handleInput}
      suppressContentEditableWarning
    >
      {INITIAL_TEXT}
    </div>
  );
};

export default Editor;
