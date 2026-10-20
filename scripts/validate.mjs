import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import YAML from "yaml";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const schemaPath = path.join(repositoryRoot, "schema", "scanpcb.schema.yaml");
const exampleDirectories = ["demo-board", "olimex-esp32-c6-evb"];

const schema = YAML.parse(await readFile(schemaPath, "utf8"));
const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile(schema);
let hasErrors = false;

for (const exampleDirectory of exampleDirectories) {
  const boardDirectory = path.join(repositoryRoot, "examples", exampleDirectory);
  const manifestPath = path.join(boardDirectory, "scanpcb.yaml");
  const manifest = YAML.parse(await readFile(manifestPath, "utf8"));
  let boardHasErrors = false;

  if (!validate(manifest)) {
    console.error(`ScanPCB manifest validation failed: ${path.relative(repositoryRoot, manifestPath)}`);
    for (const error of validate.errors ?? []) {
      console.error(`- ${error.instancePath || "/"}: ${error.message}`);
    }
    hasErrors = true;
    continue;
  }

  console.log(`Schema valid: ${path.relative(repositoryRoot, manifestPath)}`);

  const referencedPaths = new Set();
  for (const revision of manifest.revisions) {
    referencedPaths.add(revision.changelog);
    for (const artifact of Object.values(revision.hardware)) referencedPaths.add(artifact.path);
    referencedPaths.add(revision.firmware.path);
    for (const diagnosticPath of Object.values(revision.diagnostics)) referencedPaths.add(diagnosticPath);
    for (const imagePath of revision.images) referencedPaths.add(imagePath);
  }
  referencedPaths.add(manifest.qr.asset_svg);

  for (const relativePath of referencedPaths) {
    try {
      await access(path.resolve(boardDirectory, relativePath));
    } catch {
      console.error(`${exampleDirectory}: missing referenced path ${relativePath}`);
      boardHasErrors = true;
      hasErrors = true;
    }
  }

  if (!boardHasErrors) console.log(`Referenced paths valid: ${referencedPaths.size}`);
}

if (hasErrors) process.exitCode = 1;
