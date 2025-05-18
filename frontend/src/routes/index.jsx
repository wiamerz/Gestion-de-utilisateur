import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import Home from "../components/home";
import Logout from "../components/Logout";
import RegistreForm from "../components/Registre";
import LoginForm from "../components/Login";
import RedirectIfAuth from "./RedirectIfAuth";
import Verification from "../components/Verification";
import Profile from "../components/Profile";
import Password from "../components/Password"

const Routes = () => {
  const { token } = useAuth();

  const router = createBrowserRouter([
    // Accessible par tout le monde
    {
      path: "/verification",
      element: <Verification />,
    },

    // Redirection racine
    {
      path: "/",
      element: token ? <Navigate to="/home" /> : <Navigate to="/login" />,
    },

    // Routes authentifiées
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          path: "home",
          element: <Home />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "logout",
          element: <Logout />,
        },
      ],
    },

    // Routes non-authentifiées
    {
      path: "/",
      element: <RedirectIfAuth />,
      children: [
        {
          path: "login",
          element: <LoginForm />,
        },
        {
          path: "password",
          element: <Password />,
        },
        {
          path: "registre",
          element: <RegistreForm />,
        },
      ],
    },

    // Page 404
    {
      path: "*",
      element: <div className="text-center p-10 text-red-600">404 - Page non trouvée</div>,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
