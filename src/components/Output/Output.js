import { useState } from "react";

import "./Output.css";

const Output = ({ changedSentences, sentencesWithIds }) => {
  // State
  const [activeOutput, setActiveOutput] = useState("changedSentences");

  return (
    <div className="Output">
      <div className="Output-Tabs">
        <div
          className={`Output-Tab ${
            activeOutput === "sentencesWithIds" ? "active" : ""
          }`}
          onClick={() => setActiveOutput("sentencesWithIds")}
        >
          All sentences
        </div>
        <div
          className={`Output-Tab ${
            activeOutput === "changedSentences" ? "active" : ""
          }`}
          onClick={() => setActiveOutput("changedSentences")}
        >
          Changed only
        </div>
      </div>
      <div className="Output-Content">
        {activeOutput === "sentencesWithIds" && (
          <pre>{JSON.stringify(sentencesWithIds, null, 2)}</pre>
        )}
        {activeOutput === "changedSentences" && (
          <pre>{JSON.stringify(changedSentences, null, 2)}</pre>
        )}
      </div>
    </div>
  );
};

export default Output;
