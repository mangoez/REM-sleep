# Review Notes

This is the scratchpad for why the app is shaped this way.

The short version: keep the app tiny, keep stories as plain data, keep all voice
weirdness inside `docs/narrator.js`, and do not let the pwincess say `r`.

## Rules I am trying to keep

- `docs/narrator.js` owns speech, voices, queueing, canceling, pause, and resume.
- `docs/app.js` owns the old-reddit UI and routing.
- `docs/stories/*.js` should stay boring. They are just data.
- The validator should catch bad story data before the browser does.
- Do not add clever abstractions unless they actually delete pain.
- If something is weird on purpose, leave a short note near it.

## Decisions

### Story lines

Stories are split by hand into `lines[]`.

That is less magical than splitting sentences at runtime, but it avoids all the
annoying edge cases like `Mr.`, ellipses, usernames, and long lines that make
browser TTS flake out.

### Voices

The browser build uses `speechSynthesis`.

Right now the narrator asks the browser for installed voices and scores them.
The mod wants a human-sounding man voice. The pwincess wants a human-sounding
girl voice. If the browser does not have a good match, it falls back to the
default voice.

The cringe is still in the story text. We are not cleaning it up before speech.

## Build log

### 1. Skeleton and TTS check

Created the basic folder and `docs/tts-check.html`.

That page stayed in the repo because it is useful when voices sound wrong.

Checked:

- page loads
- buttons call narrator methods
- current line highlight moves

Audio still needs human ears. A test can say the function ran, but it cannot
tell if the bit landed.

### 2. Narrator module

Built `docs/narrator.js` around four calls:

- `play`
- `pause`
- `resume`
- `stop`

Pause cancels the current utterance. Resume starts that same line again. That is
simple and predictable.

The session counter exists so old speech callbacks cannot advance a newer run.
Without that, fast play/stop/play clicks can get weird.

### 3. Stories and checker

Added five stories and `scripts/check-stories.js`.

The checker loads the same story files as the browser. One source of truth.

It checks:

- at least five stories
- unique ids
- real titles and blurbs
- valid speakers
- line length
- enough pwincess lines
- no `r` in pwincess lines

The first checker run caught a bad pwincess line immediately, so it was worth it.

### 4. Old-reddit UI

Added the catalog page, story page, sidebar, fake votes, and player buttons.

Routing uses `location.hash`, so the app works from a static file and from
GitHub Pages.

The UI calls narrator methods only. No TTS details leak into the UI.

### 5. GitHub Pages

The repo is `mangoez/REM-sleep`.

Pages needs to publish from:

```text
master / docs
```

The live route is:

```text
https://mangoez.github.io/REM-sleep/
```

Story routes are hash routes, for example:

```text
https://mangoez.github.io/REM-sleep/#/s/red-riding-hood
```

If `/REM-sleep/` itself 404s, it is a Pages setup problem, not a hash-routing
problem.

### 6. Better browser voices

Changed narrator voice selection so it asks the browser for installed voices and
prefers nicer human-sounding voices.

No `spokenText` layer. No cleanup pass. The app speaks the cringe exactly as it
is written.

## Current checks

Run these before pushing:

```sh
node scripts/check-stories.js
node --check docs/narrator.js
node --check docs/app.js
node --check scripts/check-stories.js
```

## Still annoying

- GitHub Pages only works if the repo visibility and Pages settings allow it.
- Browser voices depend on the device. We can prefer voices, not install them.
- Real audio quality still needs an ear check.
