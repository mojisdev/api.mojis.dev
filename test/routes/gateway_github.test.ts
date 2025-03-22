import {
  createExecutionContext,
  env,
  fetchMock,
  waitOnExecutionContext,
} from "cloudflare:test";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import worker from "../../src";

beforeAll(() => {
  fetchMock.activate();
  fetchMock.disableNetConnect();
});

afterEach(() => fetchMock.assertNoPendingInterceptors());

describe("gateway_github", () => {
  const mockGitHubEmojis = {
    smile: "https://github.githubassets.com/images/icons/emoji/unicode/1f642.png",
    laughing: "https://github.githubassets.com/images/icons/emoji/unicode/1f602.png",
  };

  it("should return GitHub emojis", async () => {
    fetchMock
      .get("https://api.github.com")
      .intercept({ path: "/emojis" })
      .reply(200, mockGitHubEmojis);

    const request = new Request("https://api.mojis.dev/api/gateway/github/emojis");
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(200);
    expect(response.headers.get("X-Cache")).toBe("MISS");
    const data = await response.json();
    expect(data).toEqual(mockGitHubEmojis);
  });

  it("should handle GitHub API errors", async () => {
    fetchMock
      .get("https://api.github.com")
      .intercept({ path: "/emojis" })
      .reply(403, "API rate limit exceeded");

    const request = new Request("https://api.mojis.dev/api/gateway/github/emojis");
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toEqual({
      message: "Internal Server Error",
      status: 500,
      path: "/api/gateway/github/emojis",
      timestamp: expect.any(String),
    });
  });

  it("should cache responses", async () => {
    fetchMock
      .get("https://api.github.com")
      .intercept({ path: "/emojis" })
      .reply(200, mockGitHubEmojis).persist();

    // first request
    const request1 = new Request("https://api.mojis.dev/api/gateway/github/emojis");
    const ctx1 = createExecutionContext();
    const response1 = await worker.fetch(request1, env, ctx1);
    await waitOnExecutionContext(ctx1);

    // second request should use cache
    const request2 = new Request("https://api.mojis.dev/api/gateway/github/emojis");
    const ctx2 = createExecutionContext();
    const response2 = await worker.fetch(request2, env, ctx2);
    await waitOnExecutionContext(ctx2);

    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);
    expect(response1.headers.get("X-Cache")).toBe("MISS");
    expect(response2.headers.get("X-Cache")).toBe("HIT");
    expect(response1.headers.get("cache-control")).toBe("max-age=3600, immutable");
    expect(response2.headers.get("cache-control")).toBe("max-age=3600, immutable");
  });
});
