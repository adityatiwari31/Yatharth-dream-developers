// Bookmarks ("Saved villas") live in the visitor's browser only. No account needed.

export type SavedVilla = { id: string; slug: string; name: string; image: string; sub: string };

const KEY = "ydd:saved";
export const SAVED_EVENT = "ydd:saved-changed";

export function getSaved(): SavedVilla[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as SavedVilla[]) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function write(list: SavedVilla[]) {
  window.localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(SAVED_EVENT));
}

export function isSaved(id: string) {
  return getSaved().some((v) => v.id === id);
}

export function toggleSaved(item: SavedVilla): boolean {
  const list = getSaved();
  const exists = list.some((v) => v.id === item.id);
  write(exists ? list.filter((v) => v.id !== item.id) : [item, ...list]);
  return !exists;
}

export function removeSaved(id: string) {
  write(getSaved().filter((v) => v.id !== id));
}

export function clearSaved() {
  write([]);
}
