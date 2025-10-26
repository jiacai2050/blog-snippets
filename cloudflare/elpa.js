/**
 * A script to proxy ELPA package repositories:
 * MELPA, MELPA Stable, GNU ELPA, and NonGNU ELPA.
 *
 * It handles static assets and rewrites URLs in MELPA JavaScript files
 * to ensure proper routing through the proxy.
 *
 * It could be deployed on Cloudflare Workers or deno Deploy.
 */

export default {
  async fetch(req, env, ctx) {
    const { pathname, searchParams } = new URL(req.url);
    if (pathname === "/") {
      return Response.redirect(
        "https://emacs.liujiacai.net/post/048-elpa-proxy/",
      );
    }

    return await proxy(pathname, req);
  },
};

const UPSTREAM_URL = {
  "melpa": "https://melpa.org/packages/",
  "melpa-stable": "https://stable.melpa.org/packages/",
  "gnu": "https://elpa.gnu.org/packages/",
  "nongnu": "https://elpa.nongnu.org/nongnu/",
};

const STATIC_ROUTES = {
  // For GNU ELPA
  "/javascript/package-search.js":
    "https://elpa.gnu.org/javascript/package-search.js",
  "/layout.css": "https://elpa.gnu.org/layout.css",
  "/images/elpa-small.png": "https://elpa.gnu.org/images/elpa-small.png",
  "/images/rss.svg": "https://elpa.gnu.org/images/rss.svg",

  // For MELPA
  "/melpa/": "https://melpa.org/",
  "/melpa/css/melpa.css": "https://melpa.org/css/melpa.css",
  "/melpa/js/melpa.js": "https://melpa.org/js/melpa.js",
  "/melpa/recipes.json": "https://melpa.org/recipes.json",
  "/melpa/archive.json": "https://melpa.org/archive.json",
  "/melpa/download_counts.json": "https://melpa.org/download_counts.json",
  "/melpa/build-status.json": "https://melpa.org/build-status.json",

  // For MELPA Stable
  "/melpa-stable/": "https://stable.melpa.org/",
  "/melpa-stable/css/melpa.css": "https://stable.melpa.org/css/melpa.css",
  "/melpa-stable/js/melpa.js": "https://stable.melpa.org/js/melpa.js",
  "/melpa-stable/recipes.json": "https://stable.melpa.org/recipes.json",
  "/melpa-stable/archive.json": "https://stable.melpa.org/archive.json",
  "/melpa-stable/download_counts.json":
    "https://stable.melpa.org/download_counts.json",
  "/melpa-stable/build-status.json":
    "https://stable.melpa.org/build-status.json",
};

const CACHE_TTL = 3600 * 24; // 24 hours

async function proxy(pathname, req) {
  if (pathname in STATIC_ROUTES) {
    const url = STATIC_ROUTES[pathname];
    if (url.endsWith("/melpa.js")) {
      const res = await fetchUpstream(url, req);
      const body = await res.text();
      const prefix = url.includes("stable.melpa.org")
        ? "/melpa-stable"
        : "/melpa";
      const modifiedBody = body
        .replace("/recipes.json", `${prefix}/recipes.json`)
        .replace("/archive.json", `${prefix}/archive.json`)
        .replace("/download_counts.json", `${prefix}/download_counts.json`)
        .replace("/build-status.json", `${prefix}/build-status.json`);
      return new Response(modifiedBody, {
        status: res.status,
        headers: res.headers,
      });
    } else {
      return await fetchUpstream(url, req);
    }
  }

  let upstream;
  if (pathname.startsWith("/melpa/")) {
    upstream = "melpa";
    pathname = pathname.substring("/melpa/".length);
  } else if (pathname.startsWith("/melpa-stable/")) {
    upstream = "melpa-stable";
    pathname = pathname.substring("/melpa-stable/".length);
  } else if (pathname.startsWith("/gnu/")) {
    upstream = "gnu";
    pathname = pathname.substring("/gnu/".length);
  } else if (pathname.startsWith("/nongnu/")) {
    upstream = "nongnu";
    pathname = pathname.substring("/nongnu/".length);
  } else {
    return new Response(
      `Upstream(${pathname}) not specified, URL must be end with a '/'`,
      { status: 400 },
    );
  }

  const url = UPSTREAM_URL[upstream] + pathname;
  return await fetchUpstream(url, req);
}

async function fetchUpstream(url, req) {
  const ttl =
    url.includes("archive-contents") || url.includes("elpa-packages.eld")
      ? 3600
      : CACHE_TTL;
  console.log(`Fetching from upstream: ${url}, cache ttl: ${ttl}s`);
  return await fetch(url, {
    method: req.method,
    headers: req.headers,
    redirect: "follow",
    cf: {
      cacheEverything: true,
      cacheTtl: ttl,
    },
  });
}
