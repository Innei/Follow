// server/lib/load-env.ts
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
var __dirname = dirname(fileURLToPath(import.meta.url));
config({
  path: resolve(__dirname, "../../.env")
});

// server/index.ts
import { createRequire as createRequire2 } from "node:module";
import middie from "@fastify/middie";
import Fastify from "fastify";

// server/router/global.ts
import { readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path, { dirname as dirname3, resolve as resolve3 } from "node:path";
import { fileURLToPath as fileURLToPath3 } from "node:url";

// server/lib/api-client.ts
import { dirname as dirname2, resolve as resolve2 } from "node:path";
import { fileURLToPath as fileURLToPath2 } from "node:url";
import { config as config2 } from "dotenv";

// node_modules/hono/dist/utils/cookie.js
var _serialize = (name, value, opt = {}) => {
  let cookie = `${name}=${value}`;
  if (name.startsWith("__Secure-") && !opt.secure) {
    throw new Error("__Secure- Cookie must have Secure attributes");
  }
  if (name.startsWith("__Host-")) {
    if (!opt.secure) {
      throw new Error("__Host- Cookie must have Secure attributes");
    }
    if (opt.path !== "/") {
      throw new Error('__Host- Cookie must have Path attributes with "/"');
    }
    if (opt.domain) {
      throw new Error("__Host- Cookie must not have Domain attributes");
    }
  }
  if (opt && typeof opt.maxAge === "number" && opt.maxAge >= 0) {
    if (opt.maxAge > 3456e4) {
      throw new Error(
        "Cookies Max-Age SHOULD NOT be greater than 400 days (34560000 seconds) in duration."
      );
    }
    cookie += `; Max-Age=${Math.floor(opt.maxAge)}`;
  }
  if (opt.domain && opt.prefix !== "host") {
    cookie += `; Domain=${opt.domain}`;
  }
  if (opt.path) {
    cookie += `; Path=${opt.path}`;
  }
  if (opt.expires) {
    if (opt.expires.getTime() - Date.now() > 3456e7) {
      throw new Error(
        "Cookies Expires SHOULD NOT be greater than 400 days (34560000 seconds) in the future."
      );
    }
    cookie += `; Expires=${opt.expires.toUTCString()}`;
  }
  if (opt.httpOnly) {
    cookie += "; HttpOnly";
  }
  if (opt.secure) {
    cookie += "; Secure";
  }
  if (opt.sameSite) {
    cookie += `; SameSite=${opt.sameSite.charAt(0).toUpperCase() + opt.sameSite.slice(1)}`;
  }
  if (opt.partitioned) {
    if (!opt.secure) {
      throw new Error("Partitioned Cookie must have Secure attributes");
    }
    cookie += "; Partitioned";
  }
  return cookie;
};
var serialize = (name, value, opt) => {
  value = encodeURIComponent(value);
  return _serialize(name, value, opt);
};

// node_modules/hono/dist/client/utils.js
var mergePath = (base, path2) => {
  base = base.replace(/\/+$/, "");
  base = base + "/";
  path2 = path2.replace(/^\/+/, "");
  return base + path2;
};
var replaceUrlParam = (urlString, params) => {
  for (const [k, v] of Object.entries(params)) {
    const reg = new RegExp("/:" + k + "(?:{[^/]+})?\\??");
    urlString = urlString.replace(reg, v ? `/${v}` : "");
  }
  return urlString;
};
var replaceUrlProtocol = (urlString, protocol) => {
  switch (protocol) {
    case "ws":
      return urlString.replace(/^http/, "ws");
    case "http":
      return urlString.replace(/^ws/, "http");
  }
};
var removeIndexString = (urlSting) => {
  if (/^https?:\/\/[^\/]+?\/index$/.test(urlSting)) {
    return urlSting.replace(/\/index$/, "/");
  }
  return urlSting.replace(/\/index$/, "");
};
function isObject(item) {
  return typeof item === "object" && item !== null && !Array.isArray(item);
}
function deepMerge(target, source) {
  if (!isObject(target) && !isObject(source)) {
    return source;
  }
  const merged = { ...target };
  for (const key in source) {
    const value = source[key];
    if (isObject(merged[key]) && isObject(value)) {
      merged[key] = deepMerge(merged[key], value);
    } else {
      merged[key] = value;
    }
  }
  return merged;
}

// node_modules/hono/dist/client/client.js
var createProxy = (callback, path2) => {
  const proxy = new Proxy(() => {
  }, {
    get(_obj, key) {
      if (typeof key !== "string" || key === "then") {
        return void 0;
      }
      return createProxy(callback, [...path2, key]);
    },
    apply(_1, _2, args) {
      return callback({
        path: path2,
        args
      });
    }
  });
  return proxy;
};
var ClientRequestImpl = class {
  url;
  method;
  queryParams = void 0;
  pathParams = {};
  rBody;
  cType = void 0;
  constructor(url, method) {
    this.url = url;
    this.method = method;
  }
  fetch = async (args, opt) => {
    if (args) {
      if (args.query) {
        for (const [k, v] of Object.entries(args.query)) {
          if (v === void 0) {
            continue;
          }
          this.queryParams ||= new URLSearchParams();
          if (Array.isArray(v)) {
            for (const v2 of v) {
              this.queryParams.append(k, v2);
            }
          } else {
            this.queryParams.set(k, v);
          }
        }
      }
      if (args.form) {
        const form = new FormData();
        for (const [k, v] of Object.entries(args.form)) {
          if (Array.isArray(v)) {
            for (const v2 of v) {
              form.append(k, v2);
            }
          } else {
            form.append(k, v);
          }
        }
        this.rBody = form;
      }
      if (args.json) {
        this.rBody = JSON.stringify(args.json);
        this.cType = "application/json";
      }
      if (args.param) {
        this.pathParams = args.param;
      }
    }
    let methodUpperCase = this.method.toUpperCase();
    const headerValues = {
      ...(args == null ? void 0 : args.header) ?? {},
      ...typeof (opt == null ? void 0 : opt.headers) === "function" ? await opt.headers() : (opt == null ? void 0 : opt.headers) ? opt.headers : {}
    };
    if (args == null ? void 0 : args.cookie) {
      const cookies = [];
      for (const [key, value] of Object.entries(args.cookie)) {
        cookies.push(serialize(key, value, { path: "/" }));
      }
      headerValues["Cookie"] = cookies.join(",");
    }
    if (this.cType) {
      headerValues["Content-Type"] = this.cType;
    }
    const headers = new Headers(headerValues ?? void 0);
    let url = this.url;
    url = removeIndexString(url);
    url = replaceUrlParam(url, this.pathParams);
    if (this.queryParams) {
      url = url + "?" + this.queryParams.toString();
    }
    methodUpperCase = this.method.toUpperCase();
    const setBody = !(methodUpperCase === "GET" || methodUpperCase === "HEAD");
    return ((opt == null ? void 0 : opt.fetch) || fetch)(url, {
      body: setBody ? this.rBody : void 0,
      method: methodUpperCase,
      headers,
      ...opt == null ? void 0 : opt.init
    });
  };
};
var hc = (baseUrl, options) => createProxy(function proxyCallback(opts) {
  var _a;
  const parts = [...opts.path];
  if (parts[parts.length - 1] === "toString") {
    if (parts[parts.length - 2] === "name") {
      return parts[parts.length - 3] || "";
    }
    return proxyCallback.toString();
  }
  if (parts[parts.length - 1] === "valueOf") {
    if (parts[parts.length - 2] === "name") {
      return parts[parts.length - 3] || "";
    }
    return proxyCallback;
  }
  let method = "";
  if (/^\$/.test(parts[parts.length - 1])) {
    const last = parts.pop();
    if (last) {
      method = last.replace(/^\$/, "");
    }
  }
  const path2 = parts.join("/");
  const url = mergePath(baseUrl, path2);
  if (method === "url") {
    if (opts.args[0] && opts.args[0].param) {
      return new URL(replaceUrlParam(url, opts.args[0].param));
    }
    return new URL(url);
  }
  if (method === "ws") {
    const webSocketUrl = replaceUrlProtocol(
      opts.args[0] && opts.args[0].param ? replaceUrlParam(url, opts.args[0].param) : url,
      "ws"
    );
    const targetUrl = new URL(webSocketUrl);
    const queryParams = (_a = opts.args[0]) == null ? void 0 : _a.query;
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => targetUrl.searchParams.append(key, item));
        } else {
          targetUrl.searchParams.set(key, value);
        }
      });
    }
    const establishWebSocket = (...args) => {
      if ((options == null ? void 0 : options.webSocket) !== void 0 && typeof options.webSocket === "function") {
        return options.webSocket(...args);
      }
      return new WebSocket(...args);
    };
    return establishWebSocket(targetUrl.toString());
  }
  const req = new ClientRequestImpl(url, method);
  if (method) {
    options ??= {};
    const args = deepMerge(options, { ...opts.args[1] ?? {} });
    return req.fetch(opts.args[0], args);
  }
  return req;
}, []);

// server/lib/api-client.ts
import { ofetch } from "ofetch";

// package.json
var package_default = {
  name: "Follow",
  type: "module",
  version: "0.0.1-alpha.11",
  private: true,
  packageManager: "pnpm@9.10.0+sha512.73a29afa36a0d092ece5271de5177ecbf8318d454ecd701343131b8ebc0c1a91c487da46ab77c8e596d6acf1461e3594ced4becedf8921b074fbd8653ed7051c",
  description: "Next generation information browser",
  author: "Follow Team",
  license: "GPL-3.0-only",
  homepage: "https://github.com/RSSNext",
  repository: {
    url: "https://github.com/RSSNext/follow",
    type: "git"
  },
  main: "./dist/main/index.js",
  scripts: {
    "analyze:web": "rm -rf out/web && ANALYZER=1 vite build",
    build: "npm run typecheck && electron-vite build --outDir=dist && electron-forge make",
    "build:macos": "npm run typecheck && electron-vite build --outDir=dist && electron-forge make --arch=universal --platform=darwin",
    "build:server": "rm -rf out/server && tsup",
    "build:ssr": "npm run build:server && npm run build:web",
    "build:web": "rm -rf out/web && vite build",
    bump: "vv",
    dev: "electron-vite dev --outDir=dist",
    "dev:debug": "export DEBUG=true && vite --debug",
    "dev:ssr": "NODE_ENV=development tsx watch --ignore './*' server/index.ts --dev",
    "dev:web": "vite",
    format: "prettier --write .",
    "generator:i18n-template": "tsx scripts/generate-i18n-locale.ts",
    lint: "eslint",
    "lint:fix": "eslint --fix",
    "polyfill-optimize": "pnpx nolyfill install",
    prepare: "pnpm exec simple-git-hooks && shx test -f .env || shx cp .env.example .env",
    publish: "electron-vite build --outDir=dist && electron-forge publish",
    start: "electron-vite preview",
    test: "vitest",
    typecheck: "npm run typecheck:node && npm run typecheck:web",
    "typecheck:node": "tsc --noEmit -p tsconfig.node.json --composite false",
    "typecheck:web": "tsc --noEmit -p tsconfig.web.json --composite false"
  },
  dependencies: {
    "@egjs/react-infinitegrid": "4.12.0",
    "@egoist/tipc": "0.3.2",
    "@electron-toolkit/preload": "^3.0.1",
    "@electron-toolkit/utils": "^3.0.0",
    "@fastify/middie": "8.3.3",
    "@fastify/vite": "6.0.7",
    "@fontsource/sn-pro": "5.0.1",
    "@hono/auth-js": "1.0.10",
    "@hookform/resolvers": "3.9.0",
    "@iconify/tools": "4.0.6",
    "@microflash/remark-callout-directives": "4.3.1",
    "@mozilla/readability": "^0.5.0",
    "@radix-ui/react-alert-dialog": "1.1.1",
    "@radix-ui/react-avatar": "1.1.0",
    "@radix-ui/react-checkbox": "1.1.1",
    "@radix-ui/react-context-menu": "2.2.1",
    "@radix-ui/react-dialog": "1.1.1",
    "@radix-ui/react-dropdown-menu": "2.1.1",
    "@radix-ui/react-hover-card": "1.1.1",
    "@radix-ui/react-label": "2.1.0",
    "@radix-ui/react-popover": "1.1.1",
    "@radix-ui/react-radio-group": "1.2.0",
    "@radix-ui/react-scroll-area": "1.1.0",
    "@radix-ui/react-select": "2.1.1",
    "@radix-ui/react-slider": "^1.2.0",
    "@radix-ui/react-slot": "1.1.0",
    "@radix-ui/react-switch": "1.1.0",
    "@radix-ui/react-tabs": "1.1.0",
    "@radix-ui/react-toast": "1.2.1",
    "@radix-ui/react-tooltip": "1.1.2",
    "@sentry/electron": "5.4.0",
    "@sentry/react": "8.30.0",
    "@sentry/vite-plugin": "2.22.4",
    "@shikijs/transformers": "1.17.0",
    "@t3-oss/env-core": "^0.11.1",
    "@tanstack/query-sync-storage-persister": "5.56.0",
    "@tanstack/react-query": "5.56.0",
    "@tanstack/react-query-devtools": "5.56.0",
    "@tanstack/react-query-persist-client": "5.56.0",
    "@use-gesture/react": "10.3.1",
    "@yornaath/batshit": "0.10.1",
    bufferutil: "4.0.8",
    "builder-util-runtime": "9.2.5",
    "class-variance-authority": "0.7.0",
    "click-to-react-component": "1.1.0",
    clsx: "2.1.1",
    cmdk: "1.0.0",
    "cookie-parser": "1.4.6",
    dayjs: "1.11.13",
    dexie: "4.0.8",
    dnum: "^2.13.1",
    dotenv: "16.4.5",
    "electron-context-menu": "4.0.4",
    "electron-log": "5.2.0",
    "electron-squirrel-startup": "1.0.1",
    "electron-updater": "^6.3.4",
    fastify: "4.28.1",
    "font-list": "1.5.1",
    foxact: "0.2.38",
    "framer-motion": "11.5.4",
    "franc-min": "6.2.0",
    "fuse.js": "7.0.0",
    "hast-util-to-jsx-runtime": "2.3.0",
    "hast-util-to-text": "4.0.2",
    i18next: "^23.15.1",
    "i18next-browser-languagedetector": "8.0.0",
    "idb-keyval": "6.2.1",
    immer: "10.1.1",
    jotai: "2.9.3",
    lethargy: "1.0.9",
    linkedom: "^0.18.4",
    "lodash-es": "4.17.21",
    lowdb: "7.0.1",
    "msedge-tts": "1.3.4",
    nanoid: "5.0.7",
    ofetch: "1.3.4",
    "path-to-regexp": "8.1.0",
    "posthog-js": "1.161.3",
    "posthog-node": "4.2.0",
    "re-resizable": "6.9.18",
    "react-error-boundary": "4.0.13",
    "react-fast-marquee": "1.6.5",
    "react-hook-form": "7.53.0",
    "react-hotkeys-hook": "4.5.1",
    "react-i18next": "^15.0.1",
    "react-intersection-observer": "9.13.1",
    "react-resizable-layout": "npm:@innei/react-resizable-layout@0.7.3-fork.1",
    "react-router-dom": "6.26.2",
    "react-shadow": "20.5.0",
    "react-virtuoso": "4.10.4",
    "rehype-infer-description-meta": "2.0.0",
    "rehype-parse": "9.0.0",
    "rehype-sanitize": "6.0.0",
    "rehype-stringify": "10.0.0",
    "remark-directive": "3.0.0",
    "remark-gfm": "4.0.0",
    "remark-gh-alerts": "0.0.3",
    "remark-parse": "11.0.0",
    "remark-rehype": "11.1.0",
    satori: "0.11.0",
    semver: "7.6.3",
    shiki: "1.17.0",
    sonner: "^1.5.0",
    swiper: "11.1.12",
    "tailwind-merge": "2.5.2",
    tldts: "6.1.44",
    unified: "11.0.5",
    "use-context-selector": "2.0.0",
    "usehooks-ts": "3.1.0",
    "utf-8-validate": "6.0.4",
    vfile: "6.0.3",
    "vscode-languagedetection": "npm:@vscode/vscode-languagedetection@^1.0.22",
    zod: "3.23.8",
    zustand: "4.5.5"
  },
  devDependencies: {
    "@babel/generator": "7.25.6",
    "@clack/prompts": "0.7.0",
    "@egoist/tailwindcss-icons": "1.8.1",
    "@electron-forge/cli": "7.4.0",
    "@electron-forge/maker-dmg": "7.4.0",
    "@electron-forge/maker-squirrel": "7.4.0",
    "@electron-forge/maker-zip": "7.4.0",
    "@electron-forge/plugin-fuses": "7.4.0",
    "@electron-forge/publisher-github": "7.4.0",
    "@electron-toolkit/tsconfig": "^1.0.1",
    "@hono/node-server": "1.12.2",
    "@iconify-json/logos": "1.2.0",
    "@iconify-json/mingcute": "1.2.0",
    "@iconify-json/simple-icons": "^1.2.2",
    "@pengx17/electron-forge-maker-appimage": "1.2.1",
    "@tailwindcss/container-queries": "0.1.1",
    "@tailwindcss/typography": "0.5.15",
    "@types/cookie-parser": "1.4.7",
    "@types/lodash-es": "4.17.12",
    "@types/node": "^22.5.4",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vercel/ncc": "0.38.1",
    "@vitejs/plugin-legacy": "5.4.2",
    "@vitejs/plugin-react": "^4.3.1",
    cssnano: "7.0.6",
    "drizzle-orm": "0.33.0",
    electron: "32.1.0",
    "electron-devtools-installer": "3.2.0",
    "electron-packager-languages": "0.5.0",
    "electron-vite": "^2.3.0",
    eslint: "^9.10.0",
    "eslint-config-hyoban": "^3.1.5",
    "fake-indexeddb": "6.0.0",
    hono: "4.6.1",
    "lint-staged": "15.2.10",
    mkcert: "3.2.0",
    nbump: "2.0.4",
    postcss: "8.4.45",
    "postcss-js": "4.0.1",
    prettier: "3.3.3",
    react: "^18.3.1",
    "react-dom": "^18.3.1",
    rimraf: "6.0.1",
    shx: "^0.3.4",
    "simple-git-hooks": "2.11.1",
    tailwindcss: "3.4.11",
    "tailwindcss-animate": "1.0.7",
    tsup: "8.2.4",
    tsx: "4.19.1",
    typescript: "^5.6.2",
    vite: "^5.4.4",
    "vite-bundle-analyzer": "0.10.6",
    "vite-plugin-mkcert": "1.17.6",
    "vite-tsconfig-paths": "5.0.1",
    vitest: "2.0.5"
  },
  pnpm: {
    patchedDependencies: {
      "sonner@1.5.0": "patches/sonner@1.5.0.patch",
      "immer@10.1.1": "patches/immer@10.1.1.patch",
      "@mozilla/readability@0.5.0": "patches/@mozilla__readability@0.5.0.patch",
      "re-resizable": "patches/re-resizable@6.9.17.patch",
      hono: "patches/hono.patch"
    },
    overrides: {
      "is-core-module": "npm:@nolyfill/is-core-module@^1",
      isarray: "npm:@nolyfill/isarray@^1"
    }
  },
  "simple-git-hooks": {
    "pre-commit": "pnpm exec lint-staged"
  },
  "lint-staged": {
    "*": "eslint --fix",
    "*.{js,jsx,ts,tsx,json}": [
      "prettier --write "
    ]
  },
  bump: {
    before: [
      "git pull --rebase"
    ],
    after: [
      "gh pr create --title 'chore: Release v${NEW_VERSION}' --body 'v${NEW_VERSION}' --base main --head dev"
    ],
    commit_message: "chore(release): release v${NEW_VERSION}",
    tag: false,
    changelog: true,
    allowed_branches: [
      "dev"
    ]
  },
  productName: "Follow"
};

// server/lib/api-client.ts
var __dirname2 = dirname2(fileURLToPath2(import.meta.url));
config2({
  path: resolve2(__dirname2, "../.env")
});
var createApiClient = (authSessionToken) => {
  const apiFetch = ofetch.create({
    baseURL: process.env.VITE_API_URL,
    credentials: "include",
    retry: false,
    onRequestError(context) {
      if (context.error.name === "AbortError") {
        return;
      }
    }
  });
  const apiClient = hc("", {
    fetch: async (input, options = {}) => apiFetch(input.toString(), options),
    headers() {
      return {
        "X-App-Version": package_default.version,
        "X-App-Dev": process.env.NODE_ENV === "development" ? "1" : "0",
        Cookie: authSessionToken ? `authjs.session-token=${authSessionToken}` : ""
      };
    }
  });
  return apiClient;
};
var getTokenFromCookie = (cookie) => {
  const parsedCookieMap = cookie.split(";").map((item) => item.trim()).reduce((acc, item) => {
    const [key, value] = item.split("=");
    acc[key] = value;
    return acc;
  }, {});
  return parsedCookieMap["authjs.session-token"];
};

// server/lib/seo.ts
function buildSeoMetaTags(configs) {
  const { openGraph } = configs;
  return [
    `<meta property="og:title" content="${openGraph.title}" />`,
    openGraph.description ? `<meta property="og:description" content="${openGraph.description}" />` : "",
    openGraph.image ? `<meta property="og:image" content="${openGraph.image}" />` : "",
    // Twitter
    `<meta property="twitter:card" content="summary_large_image" />`,
    `<meta property="twitter:title" content="${openGraph.title}" />`,
    openGraph.description ? `<meta property="twitter:description" content="${openGraph.description}" />` : "",
    openGraph.image ? `<meta property="twitter:image" content="${openGraph.image}" />` : ""
  ];
}

// server/lib/meta-handler.ts
async function injectMetaHandler(url, req) {
  const metaArr = [];
  const apiClient = createApiClient(getTokenFromCookie(req.headers.cookie || ""));
  const hostFromReq = req.headers.host;
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
  switch (true) {
    case url.startsWith("/feed"): {
      const parsedUrl = new URL(url, "https://app.follow.is");
      const feedId = parsedUrl.pathname.split("/")[2];
      const feed = await apiClient.feeds.$get({
        query: {
          id: feedId
        }
      }).then((res) => res.data.feed);
      if (!feed) {
        return "";
      }
      if (!feed.title || !feed.description) {
        return "";
      }
      metaArr.push(
        ...buildSeoMetaTags({
          openGraph: {
            title: feed.title,
            description: feed.description,
            image: `${protocol}://${hostFromReq}/og/feed/${feed.id}`
          }
        })
      );
      break;
    }
  }
  return metaArr.join("\n");
}

// server/router/global.ts
var require2 = createRequire(import.meta.url);
var devHandler = (app2) => {
  app2.get("*", async (req, reply) => {
    const url = req.originalUrl;
    const root = resolve3(dirname3(fileURLToPath3(import.meta.url)), "../..");
    const vite = require2("../lib/dev-vite").getViteServer();
    try {
      let template = readFileSync(path.resolve(root, vite.config.root, "index.html"), "utf-8");
      template = await vite.transformIndexHtml(url, template);
      template = await transfromTemplate(template, req.originalUrl, req);
      reply.type("text/html");
      reply.send(template);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      reply.code(500).send(e);
    }
  });
};
var handler = (app2) => {
  app2.get("*", async (req, reply) => {
    const __dirname3 = dirname3(fileURLToPath3(import.meta.url));
    const listFolder = readdirSync(path.resolve(__dirname3, ".."));
    const listFolder2 = readdirSync(path.resolve(__dirname3, "../.."));
    reply.type("text/html");
    reply.send(JSON.stringify([...listFolder, ...listFolder2]));
  });
};
var globalRoute = process.env.NODE_ENV === "development" ? devHandler : handler;
async function transfromTemplate(template, url, req) {
  const dynamicInjectMetaString = await injectMetaHandler(url, req).catch((err) => {
    if (process.env.NODE_ENV === "development") {
      throw err;
    }
    return "";
  });
  template = template.replace(`<!-- SSG-META -->`, dynamicInjectMetaString);
  if (dynamicInjectMetaString) {
    template = template.replace(`<!-- SSG-META -->`, dynamicInjectMetaString);
    const endCommentString = "<!-- End Default Open Graph -->";
    const startIndex = template.indexOf("<!-- Default Open Graph -->");
    const endIndex = template.indexOf(endCommentString);
    template = template.slice(0, startIndex) + template.slice(endIndex + endCommentString.length);
  }
  return template;
}

// server/router/og.ts
var ogRoute = (app2) => {
  app2.get("/og/:type/:id", async (req, reply) => {
    const { type, id } = req.params;
    const { width, height } = req.query;
    const token = getTokenFromCookie(req.headers.cookie || "");
    const apiClient = createApiClient(token);
    switch (type) {
      case "feed": {
        const feed = await apiClient.feeds.$get({
          query: {
            id
          }
        }).then((res) => res.data.feed);
        if (!feed) {
          return reply.code(404).send("Not found");
        }
        const { image } = feed;
        if (!image) {
          return reply.code(404).send("Not found");
        }
        break;
      }
      default: {
        return reply.code(404).send("Not found");
      }
    }
  });
};

// server/index.ts
var app = Fastify({});
await app.register(middie, {
  hook: "onRequest"
});
var require3 = createRequire2(import.meta.url);
if (process.env.NODE_ENV === "development") {
  const devVite = require3("./lib/dev-vite");
  await devVite.registerDevViteServer(app);
}
ogRoute(app);
globalRoute(app);
var isVercel = process.env.VERCEL === "1";
if (!isVercel) {
  await app.listen({ port: 2233 });
  console.info("Server is running on http://localhost:2233");
}

// server/api/index.ts
async function handler2(req, res) {
  await app.ready();
  app.server.emit("request", req, res);
}
export {
  handler2 as default
};
//# sourceMappingURL=index.js.map