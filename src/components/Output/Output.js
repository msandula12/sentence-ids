import "./Output.css";

const Output = ({ sentencesWithIds }) => {
  return (
    <pre className="Output">{JSON.stringify(sentencesWithIds, null, 2)}</pre>
  );
};

export default Output;
