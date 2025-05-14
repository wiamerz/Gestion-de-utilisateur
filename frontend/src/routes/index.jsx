import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import Profile from "../components/Profile";
import Logout from "../components/Logout";
import RegistreForm from "../components/Registre";
import LoginForm from "../components/Login";
import RedirectIfAuth from './RedirectIfAuth';

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
    element: token ? <Navigate to="/profile" /> : <Navigate to="/login" />,
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
