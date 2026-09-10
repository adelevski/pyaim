import { AimGame } from "./game.js";
const $ = (id) => document.getElementById(id);
const canvas = $("arena"),
  context = canvas.getContext("2d");
const game = new AimGame(800, 500);
let frame = 0,
  previous = null;
function draw() {
  context.clearRect(0, 0, game.width, game.height);
  context.fillStyle = "#9dde83";
  for (const t of game.targets)
    context.fillRect(t.x, t.y, game.size, game.size);
}
function resize() {
  const rect = canvas.getBoundingClientRect();
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(rect.width * scale);
  canvas.height = Math.round(rect.height * scale);
  context.setTransform(scale, 0, 0, scale, 0, 0);
  game.resize(Math.max(1, rect.width), Math.max(1, rect.height));
  draw();
}
function update() {
  $("hits").value = game.hits;
  $("toggle").textContent = game.running
    ? "Pause"
    : game.started
      ? "Resume"
      : "Start";
  $("reset").disabled = !game.started;
  $("overlay").hidden = game.running;
  $("message").textContent = game.started
    ? "Paused"
    : "Click the green squares.";
  $("hint").textContent = game.started
    ? `${game.hits} hits · Resume when you’re ready.`
    : "Start when you’re ready.";
  $("status").textContent = game.running
    ? "Playing"
    : game.started
      ? "Paused"
      : "Ready";
  draw();
}
function tick(now) {
  if (!game.running) return;
  if (previous !== null) game.advance(Math.min((now - previous) / 1000, 0.1));
  previous = now;
  draw();
  frame = requestAnimationFrame(tick);
}
function pause() {
  game.pause();
  cancelAnimationFrame(frame);
  previous = null;
  update();
}
function toggle() {
  if (game.running) return pause();
  game.start();
  previous = null;
  update();
  canvas.focus({ preventScroll: true });
  frame = requestAnimationFrame(tick);
}
$("toggle").addEventListener("click", toggle);
$("reset").addEventListener("click", () => {
  pause();
  game.reset();
  update();
});
canvas.addEventListener("pointerdown", (event) => {
  if (event.button !== 0 || !event.isPrimary || !game.running) return;
  event.preventDefault();
  canvas.focus({ preventScroll: true });
  const rect = canvas.getBoundingClientRect();
  if (game.hit(event.clientX - rect.left, event.clientY - rect.top)) {
    $("hits").value = game.hits;
    draw();
  }
});
document.addEventListener("keydown", (event) => {
  if ($("about").open || event.repeat) return;
  if (event.key === "Escape") pause();
  if (
    event.code === "Space" &&
    (event.target === canvas || event.target === document.body)
  ) {
    event.preventDefault();
    toggle();
  }
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) pause();
});
window.addEventListener("blur", pause);
$("info").addEventListener("click", () => {
  pause();
  $("about").showModal();
});
new ResizeObserver(resize).observe(canvas);
resize();
update();
