import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { CreateTrip } from "./pages/create-trips/CreateTrip.jsx";
import { Navbar } from "./components/common/Navbar.jsx";
import { Footer } from "./components/common/Footer.jsx";
import { Toaster } from "./components/ui/sonner.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ViewTrip } from "./pages/view-trips/ViewTrip.jsx";
import { MyTrips } from "./pages/my-trips/MyTrips.jsx";
import { ProfilePage } from "./pages/profile/ProfilePage.jsx"; // Import the new ProfilePage
import { CommunityTrips } from "./pages/community/CommunityTrips.jsx";
import { Home } from "./pages/home/Home.jsx"

// Layout component to wrap Navbar and content
const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/create-trip",
        element: <CreateTrip />,
      },
      {
        path: "/view-trip/:tripId",
        element: <ViewTrip />,
      },
      {
        path: "/my-trips",
        element: <MyTrips />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/community",
        element: <CommunityTrips />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_API_KEY}
    >
      <Toaster />
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </React.StrictMode>
);