# ScanPCB

> One board. One QR. All the documentation needed to understand, repair and improve it.

ScanPCB gives an electronic board a persistent, portable digital identity. A QR code on the PCB, enclosure or packaging resolves to a stable board page containing revision-aware technical documentation.

The project is an early proof of concept prepared for the Linux Day talk **"ScanPCB, when an electronic board becomes open"**. It is intentionally small: open files, a documented schema, a real open-hardware example, a clearly fictional test fixture and a static web interface.

## What is ScanPCB?

ScanPCB is an open specification and reference implementation for describing electronic boards with ordinary files that work well with Git:

- `scanpcb.yaml` for board identity and revision metadata;
- Markdown for knowledge that humans maintain;
- CSV for a portable bill of materials;
- native EDA and manufacturing files when they are available;
- SVG QR codes suitable for documentation, packaging and PCB silkscreen workflows.

The repository remains the source of truth. A hosted ScanPCB service may improve discovery later, but it must never become the only place where a designer's data exists.

## Why ScanPCB?

Electronic products often outlive the website, company or person that designed them. Their schematics, BOMs, firmware and repair notes become scattered or disappear. ScanPCB keeps the identity of a board connected to the information needed to understand it.

> An electronic board should not become incomprehensible when its designer disappears.

## How it works

```text
PCB
  |
  v
QR
  |
  v
ScanPCB Board ID
  |
  v
Revision-aware documentation
  |
  v
Repair / Maintain / Improve
```

Every documented board follows the same relationship:

```text
Board -> Revisions -> Documentation -> QR
```

The QR can resolve to the latest supported revision or directly to a specific hardware revision.

## Main goals

- hardware documentation that stays readable without a proprietary platform;
- better repairability and diagnostics;
- traceability across hardware revisions;
- long-term maintenance with open formats;
- open-hardware publishing practices;
- collaborative documentation through Git issues and pull requests.

## Explore the v0.1 proof of concept

The primary example indexes the real open-source **Olimex ESP32-C6-EVB**:

- [Olimex board manifest](examples/olimex-esp32-c6-evb/scanpcb.yaml)
- [source and reuse notes](examples/olimex-esp32-c6-evb/README.md)
- [FAQ-derived known issues](examples/olimex-esp32-c6-evb/diagnostics/known-issues.md)
- [USB troubleshooting flow](examples/olimex-esp32-c6-evb/diagnostics/troubleshooting.md)
- [generated QR code](examples/olimex-esp32-c6-evb/images/olimex-esp32-c6-evb-rev-a.svg)

Manuals, schematic, dimensions, KiCad sources and software examples remain at the official Olimex product page and GitHub repository. ScanPCB stores links and attribution rather than duplicating those upstream artifacts.

The earlier [fictional Demo Board](examples/demo-board/README.md) remains as a useful local test fixture for BOM, component and test-point rendering. Its hardware source and manufacturing folders are clearly marked placeholders; the repository does not claim that an unbuilt fictional board has validated production files.

## Run the demo locally

Requirements: Node.js 20 or newer.

```bash
npm install
npm run build
npm run serve
```

Open `http://localhost:4173`. The build command validates the YAML manifest, synchronizes the web data and regenerates the SVG QR.

## Repository map

```text
ScanPCB/
|-- docs/                       Project decisions and specification
|-- schema/                     Machine-readable ScanPCB schema
|-- examples/olimex-esp32-c6-evb/ Real-board index and official links
|   |-- hardware/REV-A/           Link pointers grouped by artifact type
|   |-- software/                 Official example links
|   |-- diagnostics/              FAQ-derived issues and decision tree
|   `-- images/                   Reuse note and generated QR
|-- examples/demo-board/          Fictional local test fixture
|-- scripts/                    Validation, data sync, QR and local server
`-- web/                        Dependency-free static demonstration site
```

## Specification

The human-readable contract is in [docs/scanpcb-spec.md](docs/scanpcb-spec.md). The initial machine-readable schema is [schema/scanpcb.schema.yaml](schema/scanpcb.schema.yaml). Version `0.1` is experimental and feedback is expected before compatibility promises are made.

## Project status

**v0.1, proof of concept.** ScanPCB currently demonstrates a portable data model, revision-aware repository layout, QR generation and a board page. It is not a hosted registry, permission system, product-lifecycle service or production API.

See the [roadmap](docs/roadmap.md) for the deliberate boundary between the Linux Day demo and future work.

## How to contribute

Contributions are welcome from developers, electronic engineers, repair technicians, makers, students, UI/UX designers and open-source enthusiasts.

Useful first contributions include:

- reviewing the `scanpcb.yaml` vocabulary;
- proposing fields needed by real repair workflows;
- improving the Demo Board diagnostics;
- adding a new example board with redistributable files;
- testing QR readability in print and silkscreen workflows;
- improving accessibility and small-screen behavior in the demo page.

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening an issue or pull request.

## License

The ScanPCB repository is released under the [MIT License](LICENSE). A board author can declare separate licenses for hardware, firmware and documentation inside `scanpcb.yaml`. The Demo Board keeps its hardware license marked `TBD` until real design files exist. External Olimex resources retain their upstream licenses; the product image and documents are linked, not mirrored.

