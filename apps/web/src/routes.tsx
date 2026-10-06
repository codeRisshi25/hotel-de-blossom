import { Outlet, type RouteObject } from "react-router";
import { BookingProvider } from "./booking/BookingContext";
import { SiteLayout } from "./components/SiteLayout";
import { HomePage } from "./pages/HomePage";
import RoomsPage from "./pages/RoomsPage";
import RoomDetailPage from "./pages/RoomDetailPage";
import DiningPage from "./pages/DiningPage";
import EventsPage from "./pages/EventsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import BookPage from "./pages/BookPage";
import NotFoundPage from "./pages/NotFoundPage";
import { Navigate } from "react-router";

/**
 * Public routes. Imported eagerly so the same tree renders on the server (prerender) and in the
 * browser (hydration). Staff routes live in router.tsx and stay lazy.
 */
export const publicRoutes: RouteObject[] = [
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
          { path: "rooms", element: <RoomsPage /> },
          { path: "rooms/:slug", element: <RoomDetailPage /> },
          { path: "dining", element: <DiningPage /> },
          { path: "events", element: <EventsPage /> },
          { path: "gallery", element: <Navigate to="/" replace /> },
          { path: "about", element: <AboutPage /> },
          { path: "contact", element: <ContactPage /> },
          { path: "book", element: <BookPage /> },
          // Paths from the previous WordPress site
          { path: "our-rooms", element: <Navigate to="/rooms" replace /> },
          { path: "accommodation/deluxe-double", element: <Navigate to="/rooms/deluxe-double" replace /> },
          { path: "accommodation/deluxe-twin", element: <Navigate to="/rooms/deluxe-twin" replace /> },
          { path: "accommodation/executive-suite-room", element: <Navigate to="/rooms/executive-suite" replace /> },
          { path: "restaurant", element: <Navigate to="/dining" replace /> },
          { path: "meetings-and-events", element: <Navigate to="/events" replace /> },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
];
