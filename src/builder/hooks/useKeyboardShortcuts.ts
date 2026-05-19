import { useEffect } from "react";
import { useBuilderStore } from "../store";

export function useKeyboardShortcuts(onSave?: () => void) {
  const { selectedId, removeBlock, duplicateBlock, undo, redo, setSelected } =
    useBuilderStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isEditable =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable ||
          target.closest("[contenteditable='true']"));

      const mod = e.metaKey || e.ctrlKey;

      if (mod && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }
      if (mod && (e.key.toLowerCase() === "y" || (e.shiftKey && e.key.toLowerCase() === "z"))) {
        e.preventDefault();
        redo();
        return;
      }
      if (mod && e.key.toLowerCase() === "s") {
        e.preventDefault();
        onSave?.();
        return;
      }
      if (isEditable) return;

      if (mod && e.key.toLowerCase() === "d" && selectedId) {
        e.preventDefault();
        duplicateBlock(selectedId);
        return;
      }
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        e.preventDefault();
        removeBlock(selectedId);
        return;
      }
      if (e.key === "Escape") {
        setSelected(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedId, removeBlock, duplicateBlock, undo, redo, setSelected, onSave]);
}
