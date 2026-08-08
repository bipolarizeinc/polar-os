import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const EXPECTED_SHA256 = "67dd7e55a61c24e62cdbcf56714e2f776f1533e6a9778aab8828e8e5436a2a81";
const EXPECTED_BYTES = 2381804;
const DRIVE_FILE_ID = "1r7toHYrmdzyaoPHliPex_0dsjt1dmxA1";
const SOURCE_URL = `https://drive.usercontent.google.com/download?id=${DRIVE_FILE_ID}&export=download&confirm=t`;
const outputPath = resolve("public/media/polar/01_POLAR_Greeting.mp4");

const response = await fetch(SOURCE_URL, { redirect: "follow" });
if (!response.ok) {
  throw new Error(`Approved P.O.L.A.R. intro download failed: HTTP ${response.status}.`);
}

const bytes = Buffer.from(await response.arrayBuffer());
const sha256 = createHash("sha256").update(bytes).digest("hex");

if (bytes.length !== EXPECTED_BYTES) {
  throw new Error(`Approved P.O.L.A.R. intro byte-length mismatch: expected ${EXPECTED_BYTES}, received ${bytes.length}.`);
}

if (sha256 !== EXPECTED_SHA256) {
  throw new Error(`Approved P.O.L.A.R. intro SHA-256 mismatch: expected ${EXPECTED_SHA256}, received ${sha256}.`);
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, bytes);
console.log(`Approved P.O.L.A.R. intro promoted from Drive: ${bytes.length} bytes, sha256=${sha256}`);
