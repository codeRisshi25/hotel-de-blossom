import { renderToString } from "react-dom/server";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router";
import { publicRoutes } from "./routes";

export * from "./seo";

const handler = createStaticHandler(publicRoutes);

/** Renders one public URL to an HTML string. Used only by scripts/prerender.mjs at build time. */
export async function render(path: string): Promise<string> {
  const context = await handler.query(new Request(`http://localhost${path}`));
  if (context instanceof Response) throw new Error(`Unexpected redirect while prerendering ${path}`);
  const router = createStaticRouter(handler.dataRoutes, context);
  return renderToString(<StaticRouterProvider router={router} context={context} hydrate={false} />);
}
