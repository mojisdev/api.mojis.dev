import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { parseTarGzip } from "nanotar";

const app = new Hono<{
  Bindings: {
    EMOJI_DATA: R2Bucket;
  };
}>();

app.post(
  "/setup",
  async (c) => {
    const body = await c.req.parseBody();

    const file = Array.isArray(body.file) ? body.file[0] : body.file;

    if (file == null) {
      throw new HTTPException(400, {
        message: "No file uploaded",
      });
    }

    if (typeof file === "string") {
      throw new HTTPException(400, {
        message: "invalid file uploaded",
      });
    }

    const filePrefix = "emoji-data-main/data/";

    const tar = await parseTarGzip(await file.arrayBuffer(), {
      filter(file) {
        if (!file.name.startsWith(filePrefix) || !file.name.endsWith(".json")) {
          return false;
        }

        // remove the file prefix
        file.name = file.name.slice(filePrefix.length);

        return true;
      },
    });

    const promises = [];

    for (const entry of tar) {
      if (entry.type !== "file") continue;
      const normalizedEntryName = entry.name.replace("./", "");

      promises.push(c.env.EMOJI_DATA.put(normalizedEntryName, entry.text));
    }

    // fetch and save the emojis.lock file
    const lockResponse = await fetch("https://raw.githubusercontent.com/mojisdev/emoji-data/refs/heads/main/emojis.lock", {
      headers: {
        "User-Agent": "luxass - (api.mojis.dev)",
      },
    });

    if (!lockResponse.ok) {
      throw new HTTPException(500, {
        message: "Failed to fetch emojis.lock file",
      });
    }
    const lockData = await lockResponse.json();
    promises.push(c.env.EMOJI_DATA.put("versions.json", JSON.stringify(lockData)));

    try {
      await Promise.all(promises);
      return c.json({
        message: "Files uploaded",
      });
    } catch (err) {
      console.error(err);
      return c.json({
        message: "Failed to upload files",
      }, 500);
    }
  },
);

console.log("started the emoji data setup app");

export default app;
