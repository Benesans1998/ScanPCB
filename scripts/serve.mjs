import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const port = Number(process.env.PORT ?? 4173);

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".csv", "text/csv; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ino", "text/plain; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".md", "text/markdown; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".yaml", "text/yaml; charset=utf-8"],
  [".yml", "text/yaml; charset=utf-8"]
]);

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url ?? "/", `http://${request.headers.host}`);
  let requestPath = decodeURIComponent(requestUrl.pathname);

  if (requestPath === "/") requestPath = "/web/index.html";
  if (/^\/board\/[A-Z0-9.-]+(?:\/rev\/[A-Za-z0-9.-]+)?\/?$/.test(requestPath)) {
    requestPath = "/web/board.html";
  }

  let absolutePath = path.resolve(repositoryRoot, `.${requestPath}`);
  const relativeCheck = path.relative(repositoryRoot, absolutePath);
  if (relativeCheck.startsWith("..") || path.isAbsolute(relativeCheck)) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  try {
    let info = await stat(absolutePath);
    if (info.isDirectory()) {
      absolutePath = path.join(absolutePath, "README.md");
      info = await stat(absolutePath);
    }
    if (!info.isFile()) throw new Error("Not a file");
    response.writeHead(200, {
      "Content-Type": mimeTypes.get(path.extname(absolutePath).toLowerCase()) ?? "application/octet-stream",
      "Cache-Control": "no-store"
    });
    createReadStream(absolutePath).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`ScanPCB demo: http://localhost:${port}`);
  console.log(`Example board: http://localhost:${port}/board/OLIMEX-ESP32-C6-EVB/rev/A`);
});

