import type { Context, MiddlewareHandler } from "hono";
import { createMiddleware } from "hono/factory";

export interface CacheOptions {
  cacheName: string | ((c: Context) => Promise<string> | string);
  wait?: boolean;
  cacheControl?: string;
  vary?: string | string[];
  keyGenerator?: (c: Context) => Promise<string> | string;
}

export function cache(options: CacheOptions): MiddlewareHandler {
  if (!("caches" in globalThis)) {
    console.error("Cache Middleware is not enabled because caches is not defined.");
    return async (_c, next) => await next();
  }

  if (options.wait === undefined) {
    options.wait = false;
  }

  const cacheControlDirectives = options.cacheControl
    ?.split(",")
    .map((directive) => directive.toLowerCase());
  const varyDirectives = Array.isArray(options.vary)
    ? options.vary
    : options.vary?.split(",").map((directive) => directive.trim());
  // RFC 7231 Section 7.1.4 specifies that "*" is not allowed in Vary header.
  // See: https://datatracker.ietf.org/doc/html/rfc7231#section-7.1.4
  if (options.vary?.includes("*")) {
    throw new Error(
      "Middleware vary configuration cannot include \"*\", as it disallows effective caching.",
    );
  }

  const addHeader = (c: Context) => {
    if (cacheControlDirectives) {
      const existingDirectives
        = c.res.headers
          .get("Cache-Control")
          ?.split(",")
          .map((d) => d.trim().split("=", 1)[0]) ?? [];
      for (const directive of cacheControlDirectives) {
        let [name, value] = directive.trim().split("=", 2);
        name = name.toLowerCase();
        if (!existingDirectives.includes(name)) {
          c.header("Cache-Control", `${name}${value ? `=${value}` : ""}`, { append: true });
        }
      }
    }

    if (varyDirectives) {
      const existingDirectives
        = c.res.headers
          .get("Vary")
          ?.split(",")
          .map((d) => d.trim()) ?? [];

      const vary = Array.from(
        new Set(
          [...existingDirectives, ...varyDirectives].map((directive) => directive.toLowerCase()),
        ),
      ).sort();

      if (vary.includes("*")) {
        c.header("Vary", "*");
      } else {
        c.header("Vary", vary.join(", "));
      }
    }

    c.header("X-Cache", "MISS");
  };

  return createMiddleware(async (c, next) => {
    let key = c.req.url;
    if (options.keyGenerator) {
      key = await options.keyGenerator(c);
    }

    const cacheName
      = typeof options.cacheName === "function" ? await options.cacheName(c) : options.cacheName;
    const cache = await caches.open(cacheName);
    const response = await cache.match(key);
    if (response) {
      const newResponse = new Response(response.body, response);
      newResponse.headers.set("X-Cache", "HIT");
      return newResponse;
    }

    await next();
    if (!c.res.ok) {
      return;
    }
    addHeader(c);
    const res = c.res.clone();
    if (options.wait) {
      await cache.put(key, res);
    } else {
      c.executionCtx.waitUntil(cache.put(key, res));
    }
  });
}
