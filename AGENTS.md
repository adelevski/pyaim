# maim

- Style `maim` and `snowball` in lowercase. Read snowball's canonical principles
  before product decisions. Keep the game simple: moving squares, hit count and
  session controls. Do not add accounts, tracking, rankings or extra modes without
  an owner decision.
- Browser source is in `web/`; `npm run verify` runs behavioral tests and builds
  the public output. Node 24, no runtime dependencies. Only `dist/` is deployed
  through GitHub Pages. Never publish the entire checkout.
- Use elapsed time for motion and spawning. Pause on loss of focus/visibility;
  stop animation work while paused. Discard escaped targets. Keep target hit
  detection in the same CSS coordinate system as rendering.
- `aim.py`, `tutorial.py` and `template.py` are historical learning files. Preserve
  their provenance and distinguish them from supported browser functionality.
  Do not imply the tutorial files inherit the MIT license; see
  `THIRD-PARTY-NOTICES.md`.
- Run verification before pushing. Verify the Pages workflow and live assets
  before claiming deployment; tag only the verified commit. Do not force-push.
