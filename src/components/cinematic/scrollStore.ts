// Lightweight singleton that shares scroll progress (0..1) between the DOM
// scroll listener and the R3F render loop without forcing React re-renders.
export const scrollState = {
  progress: 0, // 0 at top of page, 1 at bottom
  smooth: 0, // damped version used by the 3D scene
  sections: 0, // number of full-viewport sections
};

export function updateScrollProgress() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  scrollState.progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
}
