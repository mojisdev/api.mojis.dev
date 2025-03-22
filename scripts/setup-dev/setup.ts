import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { unstable_startWorker } from "wrangler";

const root = path.resolve(import.meta.dirname, "../..");

async function run() {
  const worker = await unstable_startWorker({
    config: path.join(root.toString(), "./wrangler.jsonc"),
    entrypoint: path.join(root.toString(), "./scripts/setup-dev/setup-worker.ts"),
  });

  const file = await readFile(path.join(root.toString(), "./node_modules/.emoji-data/emoji-data.tar.gz"));
  const blob = new Blob([file]);

  const formData = new FormData();
  formData.append("file", blob, "emoji-data.tar.gz");

  console.log("sending request to worker");
  const res = await worker.fetch("https://api.mojis.dev/setup", {
    method: "POST",
    // @ts-expect-error hmmm
    body: formData,
  });

  const json = await res.json();

  console.log("received response from worker");
  console.log(json);

  await worker.dispose();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
