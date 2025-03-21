import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { parseTarGzip } from "nanotar";
import { unstable_startWorker } from "wrangler";

const root = path.resolve(import.meta.dirname, "../");

async function run() {
  if (!existsSync(path.join(root.toString(), "./node_modules/.emoji-data"))) {
    await mkdir(path.join(root.toString(), "./node_modules/.emoji-data"), { recursive: true });
  }

  const res = await fetch("https://github.com/mojisdev/emoji-data/archive/refs/heads/main.tar.gz");

  if (!res.ok) {
    throw new Error(`Failed to fetch emoji-data: ${res.statusText}`);
  }

  const blob = await res.blob();

  const filePrefix = "emoji-data-main/data/";

  const tar = await parseTarGzip(await blob.arrayBuffer(), {
    filter(file) {
      if (!file.name.startsWith(filePrefix) || !file.name.endsWith(".json")) {
        return false;
      }

      // remove the file prefix
      file.name = file.name.slice(filePrefix.length);

      return true;
    },
  });

  for await (const file of tar) {
    const filePath = path.join(root.toString(), "./node_modules/.emoji-data", file.name);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, file.text);
  }

  console.log("emoji data copied");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
