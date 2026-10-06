import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./router";
import "./fonts.css";
import "./styles.css";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

// Public pages are prerendered, so hydrate them. Staff pages ship an empty shell and render client-side.
if (root.hasChildNodes()) {
  // The prerendered page is already visible and its links work, so let the browser paint the hero first.
  const hydrate = () => hydrateRoot(root, app);
  const idle = () => (typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(hydrate, { timeout: 1500 }) : window.setTimeout(hydrate, 50));
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
} else createRoot(root).render(app);
