# Contributing to ScanPCB

ScanPCB is community-driven. Contributions can improve the specification, documentation, reference tools, diagnostics or example boards.

## Before you start

1. Search existing issues and pull requests.
2. Open an issue for a large change to the specification or repository structure.
3. Keep the v0.1 scope small and portable. Prefer YAML, Markdown, CSV, Git and native EDA formats.

## Propose a change

1. Fork the repository.
2. Create a focused branch, for example `fix/demo-test-points` or `spec/component-lifecycle`.
3. Make the smallest coherent change.
4. Run `npm install` once, then `npm run build` before committing.
5. Commit with a clear message.
6. Open a pull request and explain the problem, the proposed change and how it was checked.

Reviewers may accept the contribution, reject it, request changes or ask for more evidence. Technical disagreement is expected; keep discussion specific and constructive.

## Open an issue

Use an issue for:

- missing or ambiguous specification fields;
- a reproducible validation problem;
- incorrect component or diagnostic information;
- a proposed board example;
- accessibility or presentation defects.

Do not publish secrets, private design files or third-party documents that cannot be redistributed.

## Change the ScanPCB specification

A specification pull request should include:

- the use case that current fields cannot represent;
- a concrete YAML example;
- the matching JSON Schema change;
- migration impact for existing `scanpcb.yaml` files;
- updated documentation and tests or fixtures where appropriate.

Backward-compatible additions are preferred during v0.x. Breaking changes must be clearly identified.

## Add an example board

Create `examples/<board-slug>/` and include at least:

- `README.md`;
- a valid `scanpcb.yaml`;
- one hardware revision directory;
- a BOM in CSV or another open format;
- diagnostic notes or an explicit explanation when none exist;
- license information for every redistributed artifact;
- official manufacturer links for external datasheets.

Never copy a manufacturer datasheet into the repository unless redistribution is explicitly permitted. Link to the official source instead.

## Documentation style

- Use plain technical language.
- Separate verified facts from assumptions and placeholders.
- Include units and tolerances for measurements.
- Keep paths relative to the board directory.
- Preserve older hardware revisions instead of rewriting their history.

