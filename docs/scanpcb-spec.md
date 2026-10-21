# ScanPCB specification 0.1

Status: experimental proof of concept, 20 October 2026.

## 1. Purpose

The ScanPCB specification describes a portable digital identity for an electronic board. It connects a stable board identifier to revision-aware hardware, firmware, diagnostic and maintenance information.

The primary artifact is a UTF-8 YAML file named `scanpcb.yaml`. It is designed to remain understandable in a Git repository without a ScanPCB server.

## 2. Design principles

1. **Portable by default.** A complete board record can be cloned or exported.
2. **Open formats.** YAML, Markdown, CSV and native EDA files are preferred.
3. **Revision-aware.** Old hardware documentation remains available.
4. **Human and machine readable.** The same manifest supports review and tooling.
5. **No datasheet duplication.** Link to official manufacturer sources unless redistribution is allowed.
6. **Evidence over claims.** Mark placeholders, unverified values and design assumptions.
7. **Platform independence.** Hosted services may index a repository but must not own its only copy.

## 3. Conformance language

The words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY describe requirements for a conforming ScanPCB 0.1 manifest.

## 4. Root object

A manifest MUST contain:

- `scanpcb_version`: specification version as a string;
- `board`: stable identity and descriptive metadata;
- `repository`: source repository location or an explicit placeholder;
- `revisions`: one or more hardware revisions;
- `components`: principal components used by the documented revision set;
- `visibility`: intended publication level;
- `qr`: canonical board and revision URLs;
- `licenses`: project and artifact license declarations.

Unknown extension keys SHOULD be prefixed with `x-` to reduce collisions with future specification fields.

## 5. Board identity

`board.id` MUST be stable and unique within the publishing authority. The recommended format is uppercase ASCII segments separated by hyphens, for example `SCAN-DEMO-001`.

Changing a product name MUST NOT change its board ID. A materially different product SHOULD receive a new board ID; a compatible hardware iteration SHOULD be represented as a revision.

## 6. Revisions

`revisions` is an ordered list. Each entry MUST provide an `id`, date field, status and paths to revision-specific artifacts. Revision IDs MAY be semantic versions such as `1.0` or manufacturer identifiers such as `A`. When the manufacturer does not publish a trustworthy revision date, `date` SHOULD be `null` and `date_note` SHOULD explain the omission instead of inventing a date.

Paths MUST be relative to the directory containing `scanpcb.yaml`. Older revision directories MUST remain addressable after a newer revision is published.

Recommended revision status values are:

- `draft`: incomplete or not released;
- `prototype`: assembled for engineering evaluation;
- `released`: approved for its declared use;
- `deprecated`: supported for history but not recommended;
- `obsolete`: retained only for traceability.

## 7. Hardware documents

A revision can reference:

- schematic source or exported schematic;
- BOM;
- PCB source;
- Gerber fabrication data;
- pick-and-place and assembly drawings;
- mechanical models;
- changelog.

A folder that contains only a placeholder MUST say so in its own README. Tooling and user interfaces MUST NOT present placeholder content as validated production data.

## 8. Components and BOM

The manifest MAY list only principal components while the revision BOM contains every fitted part. Each component record supports references, quantity, value, manufacturer, MPN, package, description, lifecycle status, official datasheet URL, alternatives and notes.

Lifecycle values in v0.1 are `active`, `nrnd`, `eol`, `obsolete` and `unknown`. These are author assertions unless a future service records source and observation time.

Alternative components MUST NOT be interpreted as drop-in replacements solely because they appear in the file. Compatibility notes SHOULD cover pinout, ratings, firmware impact and qualification state.

## 9. Diagnostics

Test points SHOULD declare the measurement mode and expected state. DC values use an `expected` object with nominal value, unit and tolerance. Digital and periodic signals can additionally declare logic family, low/high ranges, frequency, duty cycle, protocol and setup conditions.

Known issues SHOULD include a stable issue ID, symptoms, likely cause, test, expected result, workaround or repair action, affected revisions and verification state.

A troubleshooting tree SHOULD use stable node IDs and explicit outcomes. The v0.1 reference example stores the machine-readable tree in YAML and a human rendering in Markdown.

## 10. Visibility

The data model supports:

- `public`: discoverable and openly accessible;
- `qr_only`: intended to be reached through possession of the link or QR;
- `private`: requires an access-control layer outside this proof of concept.

Visibility metadata is descriptive in v0.1. A public Git repository cannot enforce `private` or `qr_only`; authors MUST NOT commit confidential artifacts and expect the manifest to protect them.

## 11. QR and URL semantics

The board URL SHOULD remain stable:

```text
https://scanpcb.vercel.app/board/SCAN-DEMO-001
```

A revision URL MAY identify an immutable hardware revision:

```text
https://scanpcb.vercel.app/board/SCAN-DEMO-001/rev/1.0
```

QR artwork SHOULD be generated as SVG for lossless scaling. Before fabrication, the publisher SHOULD test module size, quiet zone, contrast and error correction using the intended marking process.

## 12. Licensing

The repository license does not automatically determine the license of every board artifact. `licenses` SHOULD state separate terms for project metadata, documentation, hardware and firmware. `TBD` is allowed during drafting but is not sufficient for redistributable released hardware.

## 13. Collaboration

The v0.1 workflow uses Git:

```text
PROPOSE CHANGE -> REQUEST REVIEW -> ACCEPT / REJECT / REQUEST CHANGES
```

Issues and pull requests provide provenance, review and discussion without requiring a custom collaboration backend.

## 14. Validation

The normative machine-readable shape for this proof of concept is `schema/scanpcb.schema.yaml`. Run `npm run validate` from the repository root. Schema validity does not prove that electrical values, links or replacement parts are correct.

## 15. Compatibility policy

Version 0.1 is experimental. Tools MUST reject unsupported major formats and SHOULD warn on unknown minor fields. A compatibility policy will be defined before 1.0.

