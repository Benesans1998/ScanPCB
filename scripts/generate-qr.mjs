import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";
import YAML from "yaml";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const webAssetDirectory = path.join(repositoryRoot, "web", "assets");
const examples = [
  { directory: "demo-board", webAsset: "demo-board-qr.svg" },
  { directory: "olimex-esp32-c6-evb", webAsset: "olimex-esp32-c6-evb-qr.svg" }
];

await mkdir(webAssetDirectory, { recursive: true });

const options = {
  type: "svg",
  errorCorrectionLevel: "M",
  margin: 4,
  width: 768,
  color: { dark: "#0a1712", light: "#ffffff" }
};

for (const example of examples) {
  const boardDirectory = path.join(repositoryRoot, "examples", example.directory);
  const manifest = YAML.parse(await readFile(path.join(boardDirectory, "scanpcb.yaml"), "utf8"));
  const revision = manifest.revisions[0];
  const targetUrl = manifest.qr.revision_urls[revision.id];
  const exampleOutput = path.join(boardDirectory, manifest.qr.asset_svg);
  const webOutput = path.join(webAssetDirectory, example.webAsset);

  await Promise.all([
    QRCode.toFile(exampleOutput, targetUrl, options),
    QRCode.toFile(webOutput, targetUrl, options)
  ]);
  console.log(`QR generated for ${targetUrl}`);
}
