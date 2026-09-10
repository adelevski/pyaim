import test from "node:test";
import assert from "node:assert/strict";

test("controls, pointer coordinates, focus loss and reset share the same session", async () => {
  const surface = () => ({
    listeners: {},
    addEventListener(name, handler) {
      this.listeners[name] = handler;
    },
    fire(name, event = {}) {
      this.listeners[name]?.(event);
    },
    focus() {},
  });
  const elements = Object.fromEntries(
    [
      "arena",
      "hits",
      "toggle",
      "reset",
      "overlay",
      "message",
      "hint",
      "status",
      "about",
      "info",
    ].map((id) => [id, surface()]),
  );
  elements.arena.getBoundingClientRect = () => ({
    left: 20,
    top: 80,
    width: 800,
    height: 400,
  });
  elements.arena.getContext = () => ({
    clearRect() {},
    fillRect() {},
    setTransform() {},
  });
  elements.about.showModal = () => {
    elements.about.open = true;
  };
  const document = {
    ...surface(),
    body: {},
    hidden: false,
    getElementById: (id) => elements[id],
  };
  const window = { ...surface(), devicePixelRatio: 2 };
  const frames = new Map();
  let frameId = 0;
  const saved = {
    document: globalThis.document,
    window: globalThis.window,
    ResizeObserver: globalThis.ResizeObserver,
    requestAnimationFrame: globalThis.requestAnimationFrame,
    cancelAnimationFrame: globalThis.cancelAnimationFrame,
  };
  const random = Math.random;
  Object.assign(globalThis, {
    document,
    window,
    ResizeObserver: class {
      constructor(fn) {
        this.fn = fn;
      }
      observe() {
        this.fn();
      }
    },
    requestAnimationFrame: (fn) => {
      frames.set(++frameId, fn);
      return frameId;
    },
    cancelAnimationFrame: (id) => frames.delete(id),
  });
  Math.random = () => 0.5;
  try {
    await import("../web/app.js");
    assert.equal(elements.toggle.textContent, "Start");
    elements.toggle.fire("click");
    assert.equal(elements.status.textContent, "Playing");
    assert.equal(frames.size, 1);
    elements.arena.fire("pointerdown", {
      button: 0,
      isPrimary: true,
      clientX: 30,
      clientY: 280,
      preventDefault() {},
    });
    assert.equal(elements.hits.value, 1);
    window.fire("blur");
    assert.equal(elements.status.textContent, "Paused");
    assert.equal(frames.size, 0);
    elements.toggle.fire("click");
    document.hidden = true;
    document.fire("visibilitychange");
    assert.equal(elements.status.textContent, "Paused");
    document.hidden = false;
    elements.info.fire("click");
    assert.equal(elements.about.open, true);
    elements.about.open = false;
    elements.reset.fire("click");
    assert.equal(elements.hits.value, 0);
    assert.equal(elements.toggle.textContent, "Start");
    assert.equal(elements.reset.disabled, true);
  } finally {
    Object.assign(globalThis, saved);
    Math.random = random;
  }
});
