# REM Sleep

This is a dumb little bedtime story app where a greasy reddit mod reads classic
fairy tales to his pwincess.

It is intentionally cringe. That is the point.

Live site:

https://mangoez.github.io/REM-sleep/

## What is in here

- `docs/` is the actual web app.
- `docs/stories/` has the story data.
- `docs/narrator.js` handles play, pause, resume, stop, and voice picking.
- `scripts/check-stories.js` checks that the story files are still valid.

## Run it

Open this file in a browser:

```text
docs/index.html
```

No server needed. No build step needed for the web version.

There is also a quick voice test page:

```text
docs/tts-check.html
```

Use that when the voices sound cursed and you want to know if it is the browser,
the device, or our settings.

## Voices

The browser version uses `speechSynthesis`.

The app asks the browser for installed voices and tries to pick:

- a human-sounding man voice for `mod`
- a human-sounding girl voice for `pwincess`

If the browser does not expose a good match, it falls back to whatever default
voice the browser gives us.

The story text is spoken as written. The cringe stays.

## Add a story

1. Copy one of the files in `docs/stories/`.
2. Add your story object.
3. Use this shape for each line:

```js
{ text: "mod says something" }
{ text: "pwincess says something", speaker: "pwincess" }
```

4. Add the new story script to `docs/index.html`.
5. Run the checker:

```sh
node scripts/check-stories.js
```

The checker will reject:

- empty stories
- lines over 280 characters
- unknown speakers
- any pwincess line with the letter `r`

She does not say `r`. Do not make her say `r`.

## Notes

Most of the reasoning log is in `REVIEW.md`. It is mostly here so future me can
remember why things are weird.
