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
  addBlockInside: (parentId: string, block: Block) => void;
  updateBlock: (id: string, patch: Partial<Block>) => void;
  updateBlockContent: (id: string, content: Record<string, any>) => void;
  updateBlockStyle: (id: string, style: Partial<BlockStyle>) => void;
  removeBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  setBlocks: (blocks: Block[]) => void;
  markSaved: () => void;
  markPublished: () => void;
  undo: () => void;
  redo: () => void;
}

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

const reassignIds = (b: Block): Block => ({
  ...b,
  id: crypto.randomUUID(),
  children: b.children ? b.children.map(reassignIds) : undefined,
});

// ---- Recursive tree helpers ----
const findInTree = (blocks: Block[], id: string): Block | null => {
  for (const b of blocks) {
    if (b.id === id) return b;
    if (b.children) {
      const f = findInTree(b.children, id);
      if (f) return f;
    }
  }
  return null;
};

const updateInTree = (
  blocks: Block[],
  id: string,
  fn: (b: Block) => Block
): Block[] =>
  blocks.map((b) => {
    if (b.id === id) return fn(b);
    if (b.children) return { ...b, children: updateInTree(b.children, id, fn) };
    return b;
  });

const removeInTree = (blocks: Block[], id: string): Block[] =>
  blocks.flatMap((b) => {
    if (b.id === id) return [];
    if (b.children) return [{ ...b, children: removeInTree(b.children, id) }];
    return [b];
  });

const duplicateInTree = (blocks: Block[], id: string): Block[] => {
  const out: Block[] = [];
  for (const b of blocks) {
    if (b.id === id) {
      out.push(b);
      out.push(reassignIds(clone(b)));
    } else if (b.children) {
      out.push({ ...b, children: duplicateInTree(b.children, id) });
    } else {
      out.push(b);
    }
  }
  return out;
};

const insertChild = (blocks: Block[], parentId: string, child: Block): Block[] =>
  blocks.map((b) => {
    if (b.id === parentId) {
      return { ...b, children: [...(b.children || []), child] };
    }
    if (b.children) return { ...b, children: insertChild(b.children, parentId, child) };
    return b;
  });

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
      const blocks = [...s.content.blocks];
      if (index === undefined) blocks.push(block);
      else blocks.splice(index, 0, block);
      return {
        history: pushHistory(s),
        content: { ...s.content, blocks },
        selectedId: block.id,
        dirty: true,
      };
    }),

  addBlockInside: (parentId, block) =>
    set((s) => ({
      history: pushHistory(s),
      content: { ...s.content, blocks: insertChild(s.content.blocks, parentId, block) },
      selectedId: block.id,
      dirty: true,
    })),

  updateBlock: (id, patch) =>
    set((s) => ({
      history: pushHistory(s),
      content: {
        ...s.content,
        blocks: updateInTree(s.content.blocks, id, (b) => ({ ...b, ...patch })),
      },
      dirty: true,
    })),

  updateBlockContent: (id, content) =>
    set((s) => ({
      history: pushHistory(s),
      content: {
        ...s.content,
        blocks: updateInTree(s.content.blocks, id, (b) => ({
          ...b,
          content: { ...b.content, ...content },
        })),
      },
      dirty: true,
    })),

  updateBlockStyle: (id, style) =>
    set((s) => ({
      history: pushHistory(s),
      content: {
        ...s.content,
        blocks: updateInTree(s.content.blocks, id, (b) => ({
          ...b,
          style: { ...b.style, ...style },
        })),
      },
      dirty: true,
    })),

  removeBlock: (id) =>
    set((s) => ({
      history: pushHistory(s),
      content: { ...s.content, blocks: removeInTree(s.content.blocks, id) },
      selectedId: s.selectedId === id ? null : s.selectedId,
      dirty: true,
    })),

  duplicateBlock: (id) =>
    set((s) => ({
      history: pushHistory(s),
      content: { ...s.content, blocks: duplicateInTree(s.content.blocks, id) },
      dirty: true,
    })),

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

export const findBlockById = (blocks: Block[], id: string) => findInTree(blocks, id);
