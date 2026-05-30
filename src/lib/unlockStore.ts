const KEY = "spiral-unlocked";

export const isUnlocked = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) === "true";
};

export const setUnlocked = (): void => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, "true");
};
