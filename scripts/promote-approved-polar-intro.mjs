import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const EXPECTED_SHA256 = "67dd7e55a61c24e62cdbcf56714e2f776f1533e6a9778aab8828e8e5436a2a81";
const EXPECTED_BYTES = 2381804;
const sourceDir = resolve("media-src/polar-approved-intro");
const outputPath = resolve("public/media/polar/01_POLAR_Greeting.mp4");

const parts = ["part_00.b64", "part_01.b64"];
const encoded = (
  await Promise.all(parts.map((part) => readFile(resolve(sourceDir, part), "utf8")))
).join("").replace(/\s+/g, "");

const bytes = Buffer.from(encoded, "base64");
const sha256 = createHash("sha256").update(bytes).digest("hex");

if (bytes.length !== EXPECTED_BYTES) {
  throw new Error(`Approved P.O.L.A.R. intro byte-length mismatch: expected ${EXPECTED_BYTES}, received ${bytes.length}.`);
}

if (sha256 !== EXPECTED_SHA256) {
  throw new Error(`Approved P.O.L.A.R. intro SHA-256 mismatch: expected ${EXPECTED_SHA256}, received ${sha256}.`);
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, bytes);
console.log(`Approved P.O.L.A.R. intro promoted: ${bytes.length} bytes, sha256=${sha256}`);
