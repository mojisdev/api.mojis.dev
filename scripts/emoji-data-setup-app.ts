import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { parseTarGzip } from "nanotar";

const app = new Hono<{
  Bindings: {
    EMOJI_DATA: R2Bucket;
  };
}>();

app.post(
  "/upload",
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

    c.executionCtx.waitUntil(
      Promise.all(promises),
    );

    return c.json({
      message: "Files uploaded",
    });
  },
);

console.log("started the emoji data setup app");

export default app;
