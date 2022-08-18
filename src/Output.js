const Output = ({ editorState }) => {
  return <pre>{JSON.stringify(editorState, null, 2)}</pre>;
};

export default Output;
