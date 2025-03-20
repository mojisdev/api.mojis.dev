import type { EmojiCategory } from "../../src/types";
import {
  createExecutionContext,
  env,
  waitOnExecutionContext,
} from "cloudflare:test";
import { beforeAll, describe, expect, it } from "vitest";
import worker from "../../src";

beforeAll(async () => {
  await env.EMOJI_DATA.put("v15.1/groups.json", JSON.stringify([
    {
      name: "Smileys & Emotion",
      slug: "smileys-emotion",
      subgroups: [
        "face-smiling",
        "face-affection",
        "face-tongue",
        "face-hand",
        "face-neutral-skeptical",
        "face-sleepy",
        "face-unwell",
        "face-hat",
        "face-glasses",
        "face-concerned",
        "face-negative",
        "face-costume",
        "cat-face",
        "monkey-face",
        "heart",
        "emotion",
      ],
    },
  ]));
});

describe("v1_categories", () => {
  it("should return 404 for non-existent version", async () => {
    const request = new Request("https://api.mojis.dev/api/v1/categories/999.0");
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      message: "version not found",
      status: 404,
      path: "/api/v1/categories/999.0",
      timestamp: expect.any(String),
    });
  });

  it("should redirect /latest to the actual latest version", async () => {
    const request = new Request("https://api.mojis.dev/api/v1/categories/latest");
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toMatch(/\/api\/v1\/categories\/\d+\.\d+/);
  });

  it("should return all categories for a valid version", async () => {
    const request = new Request("https://api.mojis.dev/api/v1/categories/15.1");
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(200);
    const data = await response.json() as EmojiCategory[];
    expect(Array.isArray(data)).toBe(true);
    expect(data[0]).toMatchObject({
      name: expect.any(String),
      slug: expect.any(String),
      subgroups: expect.any(Array),
    });
  });

  it("should return a specific category", async () => {
    const request = new Request("https://api.mojis.dev/api/v1/categories/15.1/smileys-emotion");
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toMatchObject({
      name: expect.any(String),
      slug: "smileys-emotion",
      subgroups: expect.any(Array),
    });
  });

  it("should handle missing version parameter", async () => {
    const request = new Request("https://api.mojis.dev/api/v1/categories/");
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      message: "Not found",
      status: 404,
      path: "/api/v1/categories/",
      timestamp: expect.any(String),
    });
  });
});
