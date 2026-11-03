import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

afterEach(() => window.localStorage.clear());

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
});

if (!window.PointerEvent) {
  // @ts-expect-error Mock PointerEvent in JSDOM
  window.PointerEvent = window.MouseEvent;
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = () => {};
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = () => {};
}
