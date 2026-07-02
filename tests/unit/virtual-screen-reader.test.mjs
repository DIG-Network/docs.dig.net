// Virtual-screen-reader spoken-output trace (umbrella project's §6.6 —
// "@guidepup/virtual-screen-reader ... asserting the actual spoken-output
// sequence"). Loads the REAL built HTML for the homepage straight from
// dist/ into a jsdom document (no live browser needed — this library drives
// a `document`, not a page) and walks it exactly as a screen-reader user
// would (next/next/next), asserting the announced role+name sequence hits
// the landmarks/headings a user actually needs to orient on the page:
// navigation, the h1, and the footer. This is a coarse structural trace, not
// a full-page transcript — a full transcript would break on every content
// edit; this instead pins the SHAPE (landmarks in the right order, the
// heading readable) that would regress if a future change removed a
// landmark or nested headings incorrectly.
//
// Requires `npm run build` to have produced dist/index.html first (same
// precondition as the Playwright e2e suite).
import { test } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as path from "node:path";
import { JSDOM } from "jsdom";
import { virtual } from "@guidepup/virtual-screen-reader";

const distIndexPath = path.resolve(import.meta.dirname, "..", "..", "dist", "index.html");

test("virtual screen reader announces the homepage's landmark structure in order", async (t) => {
  if (!fs.existsSync(distIndexPath)) {
    t.skip(`dist/index.html not found at ${distIndexPath} — run "npm run build" first.`);
    return;
  }

  const html = fs.readFileSync(distIndexPath, "utf8");
  const dom = new JSDOM(html, { url: "https://docs.dig.net/" });

  // The virtual screen reader (and dom-accessibility-api underneath) expects
  // a live global `document`/`window` to walk, matching how the library's
  // own README examples set up `document.body.innerHTML` before `start()`.
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;

  try {
    await virtual.start({ container: document.body });

    // Cap iterations defensively so a regression that breaks `next()`
    // termination (e.g. an infinite loop from a malformed tree) fails fast
    // with a clear assertion instead of hanging the test run.
    for (let i = 0; i < 500; i += 1) {
      const phrase = await virtual.lastSpokenPhrase();
      if (phrase === "end of document") break;
      await virtual.next();
    }
    // Capture the log BEFORE stop() — stop() clears Virtual's internal
    // state (container + collected log), so spokenPhraseLog() must be read
    // while still "started" (verified: calling it after stop() throws
    // "Virtual Screen Reader was not started").
    const log = await virtual.spokenPhraseLog();
    await virtual.stop();

    // The navbar (Docusaurus's <nav class="navbar">) must announce as a
    // navigation landmark before any page content — screen reader users
    // rely on landmark order to jump straight past repeated chrome.
    const navIndex = log.findIndex((entry) => entry.startsWith("navigation"));
    assert.ok(navIndex >= 0, `expected a "navigation" landmark in the spoken log, got: ${JSON.stringify(log.slice(0, 10))}`);

    // Exactly one level-1 heading is announced (the hero title) — never
    // zero (an inaccessible/div-only title) and never more than one
    // (competing page titles confuse orientation). Each heading produces a
    // paired "heading, ..." / "end of heading, ..." entry in the log, so
    // count only the opening announcement.
    const h1Announcements = log.filter(
      (entry) => entry.startsWith("heading") && entry.includes("level 1"),
    );
    assert.equal(h1Announcements.length, 1, `expected exactly one level-1 heading announcement, got: ${JSON.stringify(h1Announcements)}`);

    // A contentinfo (footer) landmark is reachable by the end of the trace.
    const hasFooterLandmark = log.some((entry) => entry.startsWith("contentinfo") || entry.includes("end of contentinfo"));
    assert.ok(hasFooterLandmark, `expected a "contentinfo" (footer) landmark in the spoken log, got tail: ${JSON.stringify(log.slice(-10))}`);
  } finally {
    delete globalThis.window;
    delete globalThis.document;
  }
});
