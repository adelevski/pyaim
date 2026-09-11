# maim

Mouse aim.

[Play](https://snowball-projects.github.io/maim/) · [snowball](https://snowball-projects.github.io/)

Click green squares moving from left to right. Each hit adds one point. Start,
pause or reset whenever you like. Space toggles play while the game area has
focus; Escape pauses. Leaving the window or tab pauses automatically.

This began as a Python mouse-practice experiment in 2022, inspired by time spent
playing first-person shooters. The browser version keeps that small idea intact.
It is not a calibrated reaction-time test or evidence of improved FPS performance.

## Run and maintain

With Node 24 and Python 3 installed:

```sh
npm ci
npm run verify
npm run dev
```

The preview is at `http://127.0.0.1:8791/`. `npm run build` copies only `web/`,
the license and release metadata into `dist/`. No application dependencies,
external fonts, backend, API keys, accounts or telemetry are needed.

Pushes to `main` run tests and deploy `dist/` through GitHub Pages. Set repository
Settings → Pages → Source to **GitHub Actions**. A manual workflow dispatch can
republish a dormant checkout. Verify the workflow, live page and `version.json`
before tagging a release. The canonical public repository is
`snowball-projects/maim`, renamed from `pyaim` with its history intact.
The former `/pyaim/` and `/projects/pyaim/` website addresses redirect through
snowball’s main site. Keep those redirect pages when maintaining that site.

## Behavior and limits

- The original `aim.py` used one-pixel movement in an uncapped loop and did not
  remove escaped targets correctly. The browser implementation uses elapsed time,
  one new target per second and eight seconds to cross the play area. Target size
  is responsive (44–64 CSS pixels). Resize preserves horizontal progress.
- A pointer press hits at most one square, even when targets overlap. The score
  counts hits only; it is not accuracy or reaction latency. Sessions have no time
  limit. Scores disappear on reset or reload.
- Rendering uses one canvas and stops while paused. Drawing resolution is capped
  at 2× CSS dimensions. Hidden tabs do not accrue simulation time. A stalled frame
  advances at most 100 ms, favoring a playable resume over catching up lost time.
- A mouse or other pointing device is required for aiming. Touch works; controls
  are keyboard accessible. Motion starts only by choice and can always be paused.
  There is no alternate nonvisual aiming mode in this release.
- No game data is transmitted or stored. GitHub Pages handles ordinary hosting
  requests under its own policies. Operating footprint: static hosting only.

## Original experiments

These files are retained unchanged for their history, not shipped to the browser:

| File          | What it contains                                                     |
| ------------- | -------------------------------------------------------------------- |
| `aim.py`      | Moving green targets and a click counter; the basis of this release. |
| `tutorial.py` | A different Pygame exercise: keyboard movement and dodging enemies.  |
| `template.py` | A CC0 game-state template with splash/gameplay states.               |

They require Pygame and are not maintained or tested as current applications.
Their historical bugs and tutorial provenance are documented rather than hidden.

Original snowball software uses [MIT](LICENSE). Historical tutorial material has
separate scope and terms in [third-party notices](THIRD-PARTY-NOTICES.md).
The icon's [generation prompt and provenance](assets/PROMPT.md) are retained.
