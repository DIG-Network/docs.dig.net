// URN-format guard (dig_ecosystem #686 / #691).
//
// The DIG resource-identifier rules are fixed and must not drift in the docs,
// because the docs are what integrators copy:
//
//   - A resource is named by the BARE canonical URN `urn:dig:chia:<store>[:<root>]/<key>`.
//     It is NEVER prefixed with a scheme — `dig://urn:dig:…` is a malformed
//     double-scheme URI (the exact bug an external dev copied from these docs).
//   - `chia://` is the user-facing CONTENT link scheme. It addresses a store
//     (`chia://<store>:<root>/[<resource>]`), it never wraps a URN — `chia://urn:…`
//     is equally malformed.
//
// This lint fails the build if either malformed form reappears anywhere in the
// authored docs, every locale, or the generated machine artifacts — mirroring
// chip35's `urn_format_lint` so the recurrence source can't recur.
import { test } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..", "..");

/** Directories whose text content integrators read or copy from. */
const scannedRoots = ["docs", "i18n", "static"];

/** File extensions that carry copyable prose, examples, or machine specs. */
const scannedExtensions = new Set([".md", ".mdx", ".json", ".txt"]);

/** The malformed URI forms that must never appear (label -> matcher). */
const forbiddenForms = [
  {
    label: "dig:// wrapping a URN (dig://urn:dig:…) — a malformed double-scheme URI",
    pattern: /dig:\/\/urn:dig:/,
  },
  {
    label: "chia:// wrapping a URN (chia://urn:…) — chia:// addresses a store, it never wraps a URN",
    pattern: /chia:\/\/urn:/,
  },
];

function collectScannedFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return collectScannedFiles(fullPath);
    return scannedExtensions.has(path.extname(entry.name)) ? [fullPath] : [];
  });
}

const filesToScan = scannedRoots
  .map((root) => path.join(repoRoot, root))
  .filter((root) => fs.existsSync(root))
  .flatMap(collectScannedFiles);

test("docs never carry a malformed scheme-wrapped URN (#686)", () => {
  const violations = [];
  for (const file of filesToScan) {
    const lines = fs.readFileSync(file, "utf8").split("\n");
    lines.forEach((line, index) => {
      for (const form of forbiddenForms) {
        if (form.pattern.test(line)) {
          const relativePath = path.relative(repoRoot, file);
          violations.push(`${relativePath}:${index + 1} — ${form.label}\n    ${line.trim()}`);
        }
      }
    });
  }

  assert.equal(
    violations.length,
    0,
    `Found malformed scheme-wrapped URN(s). Resource IDs are the bare urn:dig:chia:… form; ` +
      `content links are chia://<store>:<root>/…:\n\n${violations.join("\n")}`,
  );
});
