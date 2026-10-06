import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router";
import { publicRoutes } from "./routes";

// Staff code (and the Supabase client) stays out of the public bundle.
const StaffApp = lazy(() => import("./staff/StaffApp"));
const StaffLogin = lazy(() => import("./staff/StaffLogin"));

const page = (node: ReactNode) => <Suspense fallback={<div className="min-h-screen bg-night" />}>{node}</Suspense>;

export const router = createBrowserRouter([
  ...publicRoutes,
  { path: "/staff", element: page(<div className="paper-noise"><StaffApp /></div>) },
  { path: "/staff/login", element: page(<div className="paper-noise"><StaffLogin /></div>) },
]);
