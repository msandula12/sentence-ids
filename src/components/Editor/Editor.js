import "./Editor.css";

const INITIAL_TEXT = "This is a sentence. This is another.";

const Editor = () => {
  return (
    <div className="Editor" contentEditable suppressContentEditableWarning>
      {INITIAL_TEXT}
    </div>
  );
};

export default Editor;
