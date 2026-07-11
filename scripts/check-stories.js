"use strict";
// Story checker. Run it with node.
// Fails loudly if any story would break the app or the bit.
const fs = require("fs");
const path = require("path");

const storiesDir = path.join(__dirname, "..", "docs", "stories");
global.REM_STORIES = []; // story files push into this, same as in the browser

for (const file of fs.readdirSync(storiesDir).filter((f) => f.endsWith(".js")).sort()) {
  require(path.join(storiesDir, file));
}

const problems = [];
const check = (ok, msg) => { if (!ok) problems.push(msg); };

check(REM_STORIES.length >= 5, `expected at least 5 stories, got ${REM_STORIES.length}`);
const ids = new Set();
for (const story of REM_STORIES) {
  const where = story.id || story.title || "<unidentified story>";
  check(typeof story.id === "string" && story.id, `${where}: missing id`);
  check(!ids.has(story.id), `duplicate id: ${story.id}`);
  ids.add(story.id);
  check(typeof story.title === "string" && story.title, `${where}: missing title`);
  check(typeof story.blurb === "string" && story.blurb, `${where}: missing blurb`);
  check(Number.isInteger(story.upvotes) && story.upvotes > 0, `${where}: upvotes must be a positive integer`);
  check(Array.isArray(story.lines) && story.lines.length >= 20, `${where}: needs >= 20 lines (a real story, not a stub)`);

  let pwincessLines = 0;
  (story.lines || []).forEach((line, i) => {
    const at = `${where} line ${i}`;
    check(typeof line.text === "string" && line.text.trim(), `${at}: empty text`);
    // ponytail: 280 char cap dodges Chrome's long utterance stall. Split lines, don't raise it
    check((line.text || "").length <= 280, `${at}: over 280 chars, split it`);
    check(line.speaker === undefined || line.speaker === "mod" || line.speaker === "pwincess",
      `${at}: unknown speaker "${line.speaker}"`);
    if (line.speaker === "pwincess") {
      pwincessLines += 1;
      // The rhotacism law: the pwincess cannot pronounce r, so the letter
      // must never appear in her lines. It is always spelled as w.
      check(!/r/i.test(line.text), `${at}: pwincess line contains an 'r': "${line.text}"`);
    }
  });
  check(pwincessLines >= 3, `${where}: only ${pwincessLines} pwincess lines; she appears throughout, minimum 3`);
}

if (problems.length) {
  console.error(`FAIL: ${problems.length} problem(s):`);
  for (const p of problems) console.error("  " + p);
  process.exit(1);
}
console.log(`OK: ${REM_STORIES.length} stories, ${REM_STORIES.reduce((n, s) => n + s.lines.length, 0)} lines, rhotacism law upheld.`);
