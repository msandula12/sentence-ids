import { Editor } from "slate";

export function getCurrentOffset(editor) {
  return getEditorTextUpToSelection(editor).length;
}

export function getCurrentOperation(editor) {
  return editor.operations[editor.operations.length - 1];
}

export function getEditorText(editor) {
  return Editor.string(editor, []);
}

export function getEditorTextUpToSelection(editor) {
  if (!editor.selection) return "";
  return Editor.string(editor, {
    anchor: {
      offset: 0,
      path: [0, 0],
    },
    focus: editor.selection.focus,
  });
}
