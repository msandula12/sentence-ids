import { Editor } from "slate";

export const getEditorText = (editor) => Editor.string(editor, []);

export const getEditorTextUpToSelection = (editor) => {
  if (!editor.selection) return "";
  return Editor.string(editor, {
    anchor: {
      offset: 0,
      path: [0, 0],
    },
    focus: editor.selection.focus,
  });
};

export const getCurrentOffset = (editor) =>
  getEditorTextUpToSelection(editor).length;

export const getCurrentOperation = (editor) =>
  editor.operations[editor.operations.length - 1];
