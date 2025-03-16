import type { TarOptionsWithAliases } from "tar";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { extract } from "tar";

const root = path.resolve(import.meta.dirname, "../");

async function run() {
  if (!existsSync(path.join(root.toString(), "./node_modules/.emoji-data"))) {
    await mkdir(path.join(root.toString(), "./node_modules/.emoji-data"), { recursive: true });
  }

  if (!existsSync(path.join(root.toString(), "./.emoji-data"))) {
    await mkdir(path.join(root.toString(), "./.emoji-data"), { recursive: true });
  }

  const res = await fetch("https://github.com/mojisdev/emoji-data/archive/refs/heads/main.tar.gz");

  if (!res.ok) {
    throw new Error(`Failed to fetch emoji-data: ${res.statusText}`);
  }

  const blob = await res.blob();

  // eslint-disable-next-line node/prefer-global/buffer
  const buffer = Buffer.from(await blob.arrayBuffer());
  await writeFile(path.join(root.toString(), "./node_modules/.emoji-data/emoji-data.tar.gz"), buffer);

  await extract(<TarOptionsWithAliases>{
    file: path.join(root.toString(), "./node_modules/.emoji-data/emoji-data.tar.gz"),
    cwd: path.join(root.toString(), "./.emoji-data"),
    onentry(entry) {
      entry.path = entry.path.split("/").splice(1).join("/");
      if (entry.path.startsWith(`data/`)) {
        // Rewrite path
        entry.path = entry.path.slice("data".length);
      } else {
        // Skip
        entry.path = "";
      }
    },
  });
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
