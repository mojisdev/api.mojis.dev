import path from "node:path";
import process from "node:process";
import { unstable_startWorker } from "wrangler";

const root = path.resolve(import.meta.dirname, "../");

async function run() {
  const res = await fetch("https://github.com/mojisdev/emoji-data/archive/refs/heads/main.tar.gz");

  if (!res.ok) {
    throw new Error(`Failed to fetch emoji-data: ${res.statusText}`);
  }

  const blob = await res.blob();

  const worker = await unstable_startWorker({
    config: path.join(root.toString(), "./wrangler.jsonc"),
    entrypoint: path.join(root.toString(), "./scripts/emoji-data-setup-app.ts"),
  });

  const formData = new FormData();
  formData.append("file", blob, "emoji-data.tar.gz");

  await worker.fetch("https://api.mojis.dev/upload", {
    method: "POST",
    // @ts-expect-error hmmm
    body: formData,
  });

  await worker.dispose();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
