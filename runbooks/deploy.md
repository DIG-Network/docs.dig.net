# Runbook — deploy docs.dig.net

## What

Publish the built Docusaurus site to the live `docs.dig.net` origin.

## Target

- **S3 bucket:** `docs-dig-net` (region `us-east-1`)
- **CloudFront distribution:** `E1G7CFG1FDYG9Y`
  (`docs.dig.net` → `E1G7CFG1FDYG9Y` → origin `docs-dig-net.s3-website-us-east-1.amazonaws.com`)

## Trigger

Deploy is **tag-driven**. Pushing a `v*` tag runs the `deploy` job in
`.github/workflows/deploy.yml`. A manual `workflow_dispatch` also triggers it. A
`pull_request` run only runs the `test` job (build + a11y/SEO suites) and never
deploys — PR contexts have no AWS credentials.

Release flow: branch → PR → merge to `main` (squash) → the release workflow cuts the
`vX.Y.Z` tag from `package.json` `version` → the tag push runs the deploy job.

## Credentials

The deploy job assumes an AWS role via GitHub OIDC — there are no stored keys. The
role ARN is the repository/environment variable `CI_DEPLOY_ROLE_ARN`
(`environment: production`, `permissions: id-token: write`).

## Steps the job runs

1. `npm ci`
2. `npm run build` (fresh checkout; generates `dist/`)
3. Configure AWS credentials via OIDC (`aws-actions/configure-aws-credentials`)
4. `aws s3 sync dist s3://docs-dig-net --delete`
5. `aws cloudfront create-invalidation --distribution-id E1G7CFG1FDYG9Y --paths '/*'`

Deploys are serialized (`concurrency: docs-dignet-deploy`, `cancel-in-progress:
false`) so two runs never race on `s3 sync --delete`.

## Verify it went live

1. Watch the run: `gh run watch <run-id>` — confirm the `deploy` job is green.
2. After the CloudFront invalidation completes, load `https://docs.dig.net` and a
   changed page; hard-refresh to bypass the browser cache.
3. Confirm the machine entry points are current:
   `https://docs.dig.net/llms.txt`, `/sitemap.xml`, `/robots.txt`,
   `/knowledge-graph.json`, `/openrpc.json`, `/error-codes.json`.

## Rollback

Re-cut/redeploy from the last known-good `vX.Y.Z` tag (dispatch the workflow on that
tag), or re-sync a previously built `dist/` from that commit. CloudFront serves the
new objects after the `/*` invalidation.
