// Coordinates and speed are CSS pixels; the renderer owns device-pixel scaling.
export class AimGame {
  constructor(width, height, random = Math.random) {
    this.random = random;
    this.width = width;
    this.height = height;
    this.reset();
  }
  get size() {
    return Math.min(64, Math.max(44, this.width / 24), this.height);
  }
  get speed() {
    return this.width / 8;
  }
  reset() {
    this.targets = [];
    this.hits = 0;
    this.running = false;
    this.started = false;
    this.untilSpawn = 1;
  }
  spawn() {
    this.targets.push({
      x: 0,
      y: this.random() * Math.max(0, this.height - this.size),
    });
  }
  start() {
    if (!this.started) {
      this.spawn();
      this.started = true;
    }
    this.running = true;
  }
  pause() {
    this.running = false;
  }
  resize(width, height) {
    const oldWidth = this.width,
      oldHeight = this.height;
    this.width = width;
    this.height = height;
    for (const t of this.targets) {
      t.x *= width / oldWidth;
      t.y = Math.min(
        Math.max(0, height - this.size),
        (t.y * height) / oldHeight,
      );
    }
  }
  advance(seconds) {
    if (!this.running || !Number.isFinite(seconds) || seconds <= 0) return;
    // Step at spawn boundaries so target positions do not depend on frame rate.
    let remaining = seconds;
    while (remaining > 1e-9) {
      const step = Math.min(remaining, this.untilSpawn);
      for (const t of this.targets) t.x += this.speed * step;
      this.targets = this.targets.filter((t) => t.x < this.width);
      remaining -= step;
      this.untilSpawn -= step;
      if (this.untilSpawn < 1e-9) {
        this.spawn();
        this.untilSpawn = 1;
      }
    }
  }
  hit(x, y) {
    if (!this.running) return false;
    for (let i = this.targets.length - 1; i >= 0; i--) {
      const t = this.targets[i];
      if (x >= t.x && x < t.x + this.size && y >= t.y && y < t.y + this.size) {
        this.targets.splice(i, 1);
        this.hits++;
        return true;
      }
    }
    return false;
  }
}
