import "./Editor.css";

const INITIAL_TEXT = "This is a sentence. This is another.";

const Editor = () => {
  const handleInput = (event) => {
    const { data: text, inputType: type } = event.nativeEvent;
    const { anchorOffset: start, focusOffset: end } = document.getSelection();
    const diffEvent = {
      end,
      start,
      text,
      type,
    };
    console.log("handleInput: ", diffEvent);
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
