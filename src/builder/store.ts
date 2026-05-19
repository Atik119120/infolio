import { create } from "zustand";
import type { Block, PageContent, DeviceMode, BlockStyle, PageTheme } from "./types";

interface HistoryState {
  past: PageContent[];
  future: PageContent[];
}

interface BuilderStore {
  pageId: string | null;
  pageName: string;
  pageSlug: string;
  isPublished: boolean;
  content: PageContent;
  selectedId: string | null;
  device: DeviceMode;
  dirty: boolean;
  history: HistoryState;
  loadPage: (p: { id: string; name: string; slug: string; isPublished: boolean; content: PageContent }) => void;
  setDevice: (d: DeviceMode) => void;
  setSelected: (id: string | null) => void;
  setName: (n: string) => void;
  setSlug: (s: string) => void;
  setTheme: (t: Partial<PageTheme>) => void;
  addBlock: (block: Block, index?: number) => void;
  updateBlock: (id: string, patch: Partial<Block>) => void;
  updateBlockContent: (id: string, content: Record<string, any>) => void;
  updateBlockStyle: (id: string, style: Partial<BlockStyle>) => void;
  removeBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  reorderBlocks: (fromId: string, toId: string) => void;
  setBlocks: (blocks: Block[]) => void;
  markSaved: () => void;
  markPublished: () => void;
  undo: () => void;
  redo: () => void;
}

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

const pushHistory = (state: BuilderStore): HistoryState => ({
  past: [...state.history.past.slice(-49), clone(state.content)],
  future: [],
});

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  pageId: null,
  pageName: "Untitled",
  pageSlug: "",
  isPublished: false,
  content: { blocks: [] },
  selectedId: null,
  device: "desktop",
  dirty: false,
  history: { past: [], future: [] },

  loadPage: ({ id, name, slug, isPublished, content }) =>
    set({
      pageId: id,
      pageName: name,
      pageSlug: slug,
      isPublished,
      content: content || { blocks: [] },
      selectedId: null,
      dirty: false,
      history: { past: [], future: [] },
    }),

  setDevice: (device) => set({ device }),
  setSelected: (selectedId) => set({ selectedId }),
  setName: (pageName) => set({ pageName, dirty: true }),
  setSlug: (pageSlug) => set({ pageSlug, dirty: true }),
  setTheme: (t) =>
    set((s) => ({
      history: pushHistory(s),
      content: { ...s.content, theme: { ...(s.content.theme || {}), ...t } },
      dirty: true,
    })),

  addBlock: (block, index) =>
    set((s) => {
      const history = pushHistory(s);
      const blocks = [...s.content.blocks];
      if (index === undefined) blocks.push(block);
      else blocks.splice(index, 0, block);
      return {
        history,
        content: { ...s.content, blocks },
        selectedId: block.id,
        dirty: true,
      };
    }),

  updateBlock: (id, patch) =>
    set((s) => {
      const history = pushHistory(s);
      return {
        history,
        content: {
          ...s.content,
          blocks: s.content.blocks.map((b) =>
            b.id === id ? { ...b, ...patch } : b
          ),
        },
        dirty: true,
      };
    }),

  updateBlockContent: (id, content) =>
    set((s) => {
      const history = pushHistory(s);
      return {
        history,
        content: {
          ...s.content,
          blocks: s.content.blocks.map((b) =>
            b.id === id ? { ...b, content: { ...b.content, ...content } } : b
          ),
        },
        dirty: true,
      };
    }),

  updateBlockStyle: (id, style) =>
    set((s) => {
      const history = pushHistory(s);
      return {
        history,
        content: {
          ...s.content,
          blocks: s.content.blocks.map((b) =>
            b.id === id ? { ...b, style: { ...b.style, ...style } } : b
          ),
        },
        dirty: true,
      };
    }),

  removeBlock: (id) =>
    set((s) => {
      const history = pushHistory(s);
      return {
        history,
        content: {
          ...s.content,
          blocks: s.content.blocks.filter((b) => b.id !== id),
        },
        selectedId: s.selectedId === id ? null : s.selectedId,
        dirty: true,
      };
    }),

  duplicateBlock: (id) =>
    set((s) => {
      const history = pushHistory(s);
      const idx = s.content.blocks.findIndex((b) => b.id === id);
      if (idx === -1) return s;
      const copy = {
        ...clone(s.content.blocks[idx]),
        id: crypto.randomUUID(),
      };
      const blocks = [...s.content.blocks];
      blocks.splice(idx + 1, 0, copy);
      return {
        history,
        content: { ...s.content, blocks },
        selectedId: copy.id,
        dirty: true,
      };
    }),

  reorderBlocks: (fromId, toId) =>
    set((s) => {
      const history = pushHistory(s);
      const blocks = [...s.content.blocks];
      const from = blocks.findIndex((b) => b.id === fromId);
      const to = blocks.findIndex((b) => b.id === toId);
      if (from === -1 || to === -1) return s;
      const [moved] = blocks.splice(from, 1);
      blocks.splice(to, 0, moved);
      return {
        history,
        content: { ...s.content, blocks },
        dirty: true,
      };
    }),

  setBlocks: (blocks) =>
    set((s) => ({
      history: pushHistory(s),
      content: { ...s.content, blocks },
      dirty: true,
    })),

  markSaved: () => set({ dirty: false }),
  markPublished: () => set({ isPublished: true, dirty: false }),

  undo: () =>
    set((s) => {
      if (!s.history.past.length) return s;
      const previous = s.history.past[s.history.past.length - 1];
      return {
        content: previous,
        history: {
          past: s.history.past.slice(0, -1),
          future: [clone(s.content), ...s.history.future],
        },
        dirty: true,
      };
    }),

  redo: () =>
    set((s) => {
      if (!s.history.future.length) return s;
      const next = s.history.future[0];
      return {
        content: next,
        history: {
          past: [...s.history.past, clone(s.content)],
          future: s.history.future.slice(1),
        },
        dirty: true,
      };
    }),
}));
