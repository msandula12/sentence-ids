import "./Output.css";

const Output = ({ editorState }) => {
  return <pre className="Output">{JSON.stringify(editorState, null, 2)}</pre>;
};

export default Output;
