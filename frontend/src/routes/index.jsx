import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import Home from "../components/home";
import Logout from "../components/Logout";
import RegistreForm from "../components/Registre";
import LoginForm from "../components/Login";
import RedirectIfAuth from './RedirectIfAuth';
import Verification from "../components/Verification";
import Profile from "../components/Profile";

const Routes = () => {
  const { token } = useAuth();

  // Routes only for non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "/",
      element: <RedirectIfAuth />,
      children: [
        {
          path: "/login",
          element: <LoginForm />,
        },
        {
          path: "/registre",
          element: <RegistreForm />,
        },
        {
          path: "/verification",
          element: <Verification />,
        },
      ],
    },
  ];

  // Routes only for authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          path: "/home",
          element: <Home />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/logout",
          element: <Logout />,
        },
      ],
    },
  ];

  // Root redirect depending on token
  const defaultRoute = {
    path: "/",
    element: token ? <Navigate to="/home" /> : <Navigate to="/login" />,
  };

  const router = createBrowserRouter([
    defaultRoute,
    ...routesForNotAuthenticatedOnly,
    ...routesForAuthenticatedOnly,
    {
      path: "*",
      element: <div className="text-center p-10 text-red-600">404 - Page non trouvée</div>,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
