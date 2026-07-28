// Install-path guard — the documented install commands must be the ones that work.
//
// The install path is the first thing a stranger runs, so a wrong command here is
// the most expensive defect the docs can carry: it reads as "DIG is broken". Four
// specific claims were each executed on a clean Ubuntu 24.04 machine and each
// failed. This lint pins the corrected form of every one, over EVERY authored
// page and every materialized locale copy, so none can quietly return.
//
// Each rule is universally quantified on purpose. An existential check ("some page
// says `sudo sh`") would pass while another page still carried the broken form —
// which is precisely how three of these four survived earlier review passes. The
// forbidden-form rules therefore scan every file, and the required-content rules
// name the exact file that must carry the fact.
import { test } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..", "..");

/** Directories whose text a stranger reads or copy-pastes from. */
const scannedRoots = ["docs", "i18n"];

/** File extensions carrying copyable prose and command examples. */
const scannedExtensions = new Set([".md", ".mdx"]);

/**
 * Forms that must appear NOWHERE, because executing them fails.
 *
 * `sh`-pipe: the universal installer's default plan installs the dig-node and
 * dig-dns services, so it requires elevation and refuses an unelevated run
 * outright — the bootstrap script does no self-elevation, so the `sudo` has to be
 * in the documented command. The pattern deliberately does not match
 * `| sudo sh`, which is the correct form.
 *
 * apt unit id: the apt repository builds its own package, whose unit is
 * `dig-node.service`. A reverse-DNS unit id on the apt page names a unit that
 * does not exist on a machine installed that way.
 */
const forbiddenForms = [
  {
    label:
      "an unelevated `| sh` install pipe — the default plan installs services, so it needs `| sudo sh`",
    pattern: /install\.sh\s*\|\s*sh\b/,
  },
  {
    label:
      "the reverse-DNS unit id on the apt page — the apt package's unit is `dig-node.service`",
    pattern: /net\.dignetwork\.dig-node/,
    onlyIn: /run-a-node[/\\]apt\.md$/,
  },
  {
    label:
      "a claim that the hosted installers are still being provisioned — install.sh, install.ps1 and apt.dig.net all serve real artifacts",
    pattern: /still being (provisioned|stood up)/i,
  },
];

/**
 * Facts a specific page MUST state, because a stranger on that page needs them to
 * reach a running node. Keyed by the path suffix of the page that owns the fact.
 */
const requiredContent = [
  {
    file: "docs/run-a-node/apt.md",
    label: "the real systemd unit the apt package installs",
    pattern: /systemctl status dig-node\b/,
  },
  {
    file: "docs/run-a-node/apt.md",
    label: "the version the apt repository actually serves, so a stranger can judge it",
    pattern: /0\.43\.0/,
  },
  {
    file: "docs/run-a-node/universal-installer.md",
    label: "the Linux unit id the installer route actually registers",
    pattern: /dignetwork-dig-node/,
  },
  {
    file: "docs/run-a-node/universal-installer.md",
    label: "the elevation requirement for the Windows one-liner",
    pattern: /administrator/i,
  },
];

function collectScannedFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return collectScannedFiles(fullPath);
    return scannedExtensions.has(path.extname(entry.name)) ? [fullPath] : [];
  });
}

const filesToScan = scannedRoots
  .map((root) => path.join(repoRoot, root))
  .filter((root) => fs.existsSync(root))
  .flatMap(collectScannedFiles);

test("no page documents an install command that fails when executed", () => {
  const violations = [];
  for (const file of filesToScan) {
    const relativePath = path.relative(repoRoot, file);
    const applicable = forbiddenForms.filter(
      (form) => !form.onlyIn || form.onlyIn.test(relativePath),
    );
    if (applicable.length === 0) continue;

    fs.readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, index) => {
        for (const form of applicable) {
          if (form.pattern.test(line)) {
            violations.push(`${relativePath}:${index + 1} — ${form.label}\n    ${line.trim()}`);
          }
        }
      });
  }

  assert.equal(
    violations.length,
    0,
    `Found install command(s) that do not work as documented:\n\n${violations.join("\n")}`,
  );
});

test("each install page states the facts a stranger needs to reach a running node", () => {
  const missing = [];
  for (const requirement of requiredContent) {
    const fullPath = path.join(repoRoot, requirement.file);
    const body = fs.readFileSync(fullPath, "utf8");
    if (!requirement.pattern.test(body)) {
      missing.push(`${requirement.file} — missing ${requirement.label} (${requirement.pattern})`);
    }
  }

  assert.equal(
    missing.length,
    0,
    `Install page(s) omit a fact the reader needs:\n\n${missing.join("\n")}`,
  );
});

test("every locale copy of an install page matches its English source", () => {
  // This repo materializes the doc tree per locale as untranslated English copies.
  // A locale copy that drifts serves a stranger a stale command — exactly how the
  // apt page ended up with two different unit ids in one tree.
  const installPages = ["index.md", "universal-installer.md", "apt.md", "configure.md"];
  const localeRoot = path.join(repoRoot, "i18n");
  const locales = fs.readdirSync(localeRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  const drifted = [];
  for (const page of installPages) {
    const source = fs.readFileSync(path.join(repoRoot, "docs", "run-a-node", page), "utf8");
    for (const locale of locales) {
      const copy = path.join(
        localeRoot, locale, "docusaurus-plugin-content-docs", "current", "run-a-node", page,
      );
      if (!fs.existsSync(copy)) continue;
      if (fs.readFileSync(copy, "utf8") !== source) {
        drifted.push(`i18n/${locale}/…/run-a-node/${page}`);
      }
    }
  }

  assert.equal(
    drifted.length,
    0,
    `Locale copies drifted from their English source:\n\n${drifted.join("\n")}`,
  );
});
