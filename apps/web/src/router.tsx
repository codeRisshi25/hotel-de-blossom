import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { BookingProvider } from "./booking/BookingContext";
import { SiteLayout } from "./components/SiteLayout";
import { HomePage } from "./pages/HomePage";

const RoomsPage = lazy(() => import("./pages/RoomsPage"));
const RoomDetailPage = lazy(() => import("./pages/RoomDetailPage"));
const DiningPage = lazy(() => import("./pages/DiningPage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const BookPage = lazy(() => import("./pages/BookPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
// Staff code (and the Supabase client) stays out of the public bundle.
const StaffApp = lazy(() => import("./staff/StaffApp"));
const StaffLogin = lazy(() => import("./staff/StaffLogin"));

const page = (node: ReactNode) => <Suspense fallback={<div className="min-h-screen bg-night" />}>{node}</Suspense>;

export const router = createBrowserRouter([
  {
    element: (
      <BookingProvider>
        <Outlet />
      </BookingProvider>
    ),
    children: [
      {
        element: <SiteLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "rooms", element: page(<RoomsPage />) },
          { path: "rooms/:slug", element: page(<RoomDetailPage />) },
          { path: "dining", element: page(<DiningPage />) },
          { path: "events", element: page(<EventsPage />) },
          { path: "gallery", element: page(<GalleryPage />) },
          { path: "about", element: page(<AboutPage />) },
          { path: "contact", element: page(<ContactPage />) },
          { path: "book", element: page(<BookPage />) },
          // Paths from the previous WordPress site
          { path: "our-rooms", element: <Navigate to="/rooms" replace /> },
          { path: "accommodation/deluxe-double", element: <Navigate to="/rooms/deluxe-double" replace /> },
          { path: "accommodation/deluxe-twin", element: <Navigate to="/rooms/deluxe-twin" replace /> },
          { path: "accommodation/executive-suite-room", element: <Navigate to="/rooms/executive-suite" replace /> },
          { path: "restaurant", element: <Navigate to="/dining" replace /> },
          { path: "meetings-and-events", element: <Navigate to="/events" replace /> },
          { path: "*", element: page(<NotFoundPage />) },
        ],
      },
    ],
  },
  { path: "/staff", element: page(<div className="paper-noise"><StaffApp /></div>) },
  { path: "/staff/login", element: page(<div className="paper-noise"><StaffLogin /></div>) },
]);
