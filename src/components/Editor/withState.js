import { updatableOperations } from "constants";
import { debounce } from "utils";

export function withState(editor, setSentencesWithIds) {
  const { apply } = editor;

  const resetIsDirty = () => {
    setSentencesWithIds((previousSentences) =>
      previousSentences.map((sentence) => ({
        ...sentence,
        isDirty: false,
      }))
    );
  };

  const resetIsDirtyDebounced = debounce(resetIsDirty, 1500);

  editor.apply = (operation) => {
    if (updatableOperations.has(operation.type)) {
      resetIsDirtyDebounced();
    }
    apply(operation);
  };

  return editor;
}
