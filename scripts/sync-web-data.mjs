import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const webDataDirectory = path.join(repositoryRoot, "web", "data");
const webAssetDirectory = path.join(repositoryRoot, "web", "assets");
const examples = [
  { directory: "demo-board", output: "demo-board.json" },
  { directory: "olimex-esp32-c6-evb", output: "olimex-esp32-c6-evb.json" }
];

const readYaml = async (boardDirectory, relativePath) =>
  YAML.parse(await readFile(path.join(boardDirectory, relativePath), "utf8"));

const localDocumentRows = (revision, directory) => [
  ["Schematic", revision.hardware.schematic],
  ["Bill of materials", revision.hardware.bom],
  ["PCB source", revision.hardware.pcb_source],
  ["Gerber", revision.hardware.gerber],
  ["Assembly", revision.hardware.assembly],
  ["Firmware", { path: revision.firmware.path, status: revision.firmware.status, format: "Arduino example" }],
  ["Test points", { path: revision.diagnostics.test_points, status: "draft", format: "YAML" }],
  ["Known issues", { path: revision.diagnostics.known_issues_human, status: "draft", format: "Markdown" }],
  ["Troubleshooting", { path: revision.diagnostics.troubleshooting_human, status: "draft", format: "Markdown + YAML" }]
].filter(([, item]) => item).map(([label, item]) => ({
  label,
  ...item,
  href: `/examples/${directory}/${item.path}`,
  external: false
}));

const webDataRecords = [];

await Promise.all([
  mkdir(webDataDirectory, { recursive: true }),
  mkdir(webAssetDirectory, { recursive: true })
]);

for (const example of examples) {
  const boardDirectory = path.join(repositoryRoot, "examples", example.directory);
  const manifest = await readYaml(boardDirectory, "scanpcb.yaml");
  const revision = manifest.revisions[0];
  const [testPoints, knownIssues, troubleshooting] = await Promise.all([
    readYaml(boardDirectory, revision.diagnostics.test_points),
    readYaml(boardDirectory, revision.diagnostics.known_issues),
    readYaml(boardDirectory, revision.diagnostics.troubleshooting)
  ]);
  const extensions = manifest.extensions ?? {};
  const externalResources = extensions["x-resources"];
  const documents = externalResources?.length
    ? externalResources.map((resource) => ({
        label: resource.label,
        kind: resource.kind,
        href: resource.url,
        format: resource.format,
        status: resource.status,
        external: true
      }))
    : localDocumentRows(revision, example.directory);

  const webData = {
    scanpcb_version: manifest.scanpcb_version,
    board: manifest.board,
    repository: manifest.repository,
    current_revision: revision,
    revisions: manifest.revisions.map(({ id, label, date, date_note, status, summary }) => ({
      id, label, date, date_note, status, summary
    })),
    components: manifest.components,
    visibility: manifest.visibility,
    qr: manifest.qr,
    licenses: manifest.licenses,
    documents,
    test_points: testPoints.test_points,
    test_points_verification: testPoints.verification,
    test_points_note: testPoints.note,
    known_issues: knownIssues.issues,
    troubleshooting: troubleshooting.tree,
    physical: extensions["x-physical"] ?? null,
    certification: extensions["x-certification"] ?? null,
    media: extensions["x-media"]?.primary ?? {
      url: "/web/assets/demo-board-top.svg",
      alt: "Illustrative top view of the ScanPCB Demo Board",
      attribution: "Concept illustration generated for the ScanPCB demo.",
      reuse: "local_demo_asset"
    },
    source_note: extensions["x-source-note"] ?? {
      label: "Prototype record",
      text: "This is a fictional documentation example. Placeholder hardware files are labeled and electrical targets are not physical measurements."
    },
    manifest_href: `/examples/${example.directory}/scanpcb.yaml`,
    source: `examples/${example.directory}/scanpcb.yaml`
  };

  await writeFile(path.join(webDataDirectory, example.output), `${JSON.stringify(webData, null, 2)}\n`, "utf8");
  webDataRecords.push({
    id: manifest.board.id,
    name: manifest.board.name,
    manufacturer: manifest.board.manufacturer ?? manifest.board.organization,
    summary: manifest.board.summary,
    revision: revision.id,
    data_file: `/web/data/${example.output}`
  });
}

await Promise.all([
  writeFile(path.join(webDataDirectory, "boards.json"), `${JSON.stringify(webDataRecords, null, 2)}\n`, "utf8"),
  copyFile(
    path.join(repositoryRoot, "examples", "demo-board", "images", "demo-board-top.svg"),
    path.join(webAssetDirectory, "demo-board-top.svg")
  )
]);

console.log(`Web data synchronized for ${webDataRecords.length} example boards`);
