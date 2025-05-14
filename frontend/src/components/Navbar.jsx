import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";

const Navbar = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    username: "",
    role: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    
    if (token && userString) {
      setIsLoggedIn(true);
      try {
        const userData = JSON.parse(userString);
        setUser({
          username: userData.username || "Utilisateur",
          role: userData.role || ""
        });
      } catch (e) {
        console.error("Erreur lors de la récupération des données utilisateur:", e);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    navigate("/");
  };

  return (
    <nav className="bg-[rgb(161,193,129)] p-4 shadow-lg text-black">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Link to="/profile" className="text-2xl font-bold">
            L9fol
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          {isLoggedIn && (
            <>
              <span>Bonjour, {user.username}</span>
              {user.role === "admin" && (
                <span className="bg-[rgb(246,233,215)] px-3 py-1 rounded-full text-sm font-medium">
                  Admin
                </span>
              )}
              <button
                onClick={handleLogout}
                className="hover:text-[rgb(243,180,78)] transition-colors duration-300"
              >
                Déconnexion
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;