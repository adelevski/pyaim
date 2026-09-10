import test from "node:test";
import assert from "node:assert/strict";
import { AimGame } from "../web/game.js";

test("start, hit and reset have predictable scoring and state", () => {
  const game = new AimGame(800, 400, () => 0.5);
  assert.equal(game.hit(1, 1), false);
  game.start();
  const target = { ...game.targets[0] };
  assert.equal(game.hit(target.x + 10, target.y + 10), true);
  assert.equal(game.hits, 1);
  assert.equal(game.hit(target.x + 10, target.y + 10), false);
  game.reset();
  assert.equal(game.hits, 0);
  assert.equal(game.targets.length, 0);
  assert.equal(game.started, false);
  assert.equal(game.running, false);
});
test("equivalent elapsed time gives the same movement at different frame rates", () => {
  const slow = new AimGame(800, 400, () => 0.5);
  const fast = new AimGame(800, 400, () => 0.5);
  slow.start();
  fast.start();
  for (let i = 0; i < 60; i++) slow.advance(1 / 30);
  for (let i = 0; i < 288; i++) fast.advance(1 / 144);
  assert.equal(slow.targets.length, 3);
  assert.equal(fast.targets.length, slow.targets.length);
  for (let i = 0; i < slow.targets.length; i++)
    assert.ok(Math.abs(slow.targets[i].x - fast.targets[i].x) < 1e-6);
});
test("pause freezes simulation; resume preserves state", () => {
  const game = new AimGame(800, 400, () => 0.5);
  game.start();
  game.advance(0.5);
  game.pause();
  const targets = structuredClone(game.targets);
  game.advance(30);
  assert.deepEqual(game.targets, targets);
  assert.equal(game.hit(targets[0].x + 10, targets[0].y + 10), false);
  game.start();
  game.advance(0.5);
  assert.equal(game.targets.length, 2);
  assert.equal(game.hits, 0);
});
test("long sessions discard escaped targets instead of accumulating them", () => {
  const game = new AimGame(800, 400, () => 0.5);
  game.start();
  for (let i = 0; i < 3600; i++) game.advance(1);
  assert.ok(game.targets.length <= 9);
  assert.ok(game.targets.every((t) => t.x >= 0 && t.x < game.width));
});
test("overlapping targets award only one hit; misses do not score", () => {
  const game = new AimGame(800, 400, () => 0);
  game.start();
  game.spawn();
  assert.equal(game.hit(799, 399), false);
  assert.equal(game.hit(1, 1), true);
  assert.equal(game.hits, 1);
  assert.equal(game.targets.length, 1);
});
test("resize preserves progress and vertical bounds", () => {
  const game = new AimGame(1000, 600, () => 1);
  game.start();
  game.advance(0.5);
  const progress = game.targets[0].x / game.width;
  game.resize(320, 220);
  assert.equal(game.size, 44);
  assert.equal(game.targets[0].x / game.width, progress);
  assert.ok(game.targets[0].y + game.size <= 220);
  game.advance(Number.NaN);
  game.advance(-1);
  assert.ok(Number.isFinite(game.targets[0].x));
});
