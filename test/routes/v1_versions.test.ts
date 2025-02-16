import type { EmojiVersion } from "../../src/types";
import {
  createExecutionContext,
  env,
  waitOnExecutionContext,
} from "cloudflare:test";
import { describe, expect, it } from "vitest";
import worker from "../../src";

describe("v1_versions", () => {
  it("should return all versions", async () => {
    const request = new Request("https://mojis.dev/api/v1/versions");
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(200);
    const data = await response.json() as EmojiVersion[];
    expect(Array.isArray(data)).toBe(true);
    expect(data[0]).toMatchObject({
      emoji_version: expect.any(String),
      unicode_version: expect.any(String),
      draft: expect.any(Boolean),
    });
  });

  it("should return latest version", async () => {
    const request = new Request("https://mojis.dev/api/v1/versions/latest");
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(200);
    const data = await response.json() as EmojiVersion;
    expect(data).toMatchObject({
      emoji_version: expect.any(String),
      unicode_version: expect.any(String),
      draft: expect.any(Boolean),
    });
  });

  it("should return latest draft version", async () => {
    const request = new Request("https://mojis.dev/api/v1/versions/draft");
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(200);
    const data = await response.json() as EmojiVersion;
    expect(data).toMatchObject({
      emoji_version: expect.any(String),
      unicode_version: expect.any(String),
      draft: true,
    });
  });

  it("should exclude draft versions when draft=true query param is set", async () => {
    const request = new Request("https://mojis.dev/api/v1/versions?draft=true");
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(200);
    const data = await response.json() as EmojiVersion[];
    expect(Array.isArray(data)).toBe(true);
    expect(data.every((version) => !version.draft)).toBe(true);
  });

  it.todo("should return 404 when no draft versions are available", async () => {
    const request = new Request("https://api.mojis.dev/api/v1/versions/draft");
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data).toMatchObject({
      message: expect.any(String),
      status: 404,
      path: "/api/v1/versions/draft",
      timestamp: expect.any(String),
    });
  });
});
