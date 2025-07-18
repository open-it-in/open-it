import Mustache from "mustache";
import config from "../config.json";
import "./src/category_template.mustache";
import "./src/app_template.mustache";
import { withHtmlLiveReload } from "bun-html-live-reload";

const server = Bun.serve({
  port: 3100,
  fetch: withHtmlLiveReload(async (req) => {
    const url = new URL(req.url);
    const pathname = url.pathname;

    if (pathname === "/") {
      return new Response(
        Mustache.render(
          await Bun.file("src/category_template.mustache").text(),
          {
            category: "Wallets",
            apps: config.apps,
          }
        ),
        { headers: { "Content-Type": "text/html" } }
      );
    }

    // Handle /:app routes
    const appName = pathname.slice(1); // Remove leading slash
    const app = config.apps.find((a) => a.name === appName);
    if (!app) {
      return new Response("App not found", { status: 404 });
    }

    return new Response(
      Mustache.render(await Bun.file("src/app_template.mustache").text(), app),
      {
        headers: { "Content-Type": "text/html" },
      }
    );
  }),
});

console.log(`Listening on ${server.url}`);
