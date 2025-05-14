import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import "../index.css";
import { useAuth } from '../provider/AuthProvider';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupération des données utilisateur depuis le localStorage
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        setUser(userData);
      } catch (e) {
        console.error("Erreur lors de la récupération des données utilisateur:", e);
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[rgb(108,88,76)]">
        <p className="text-[rgb(246,233,215)] text-xl">Chargement...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] flex flex-col justify-center items-center text-[rgb(246,233,215)] px-4 py-10">
        <div className="bg-[rgb(108,88,76)] text-[rgb(215,195,183)] p-10 rounded-lg shadow-2xl text-center max-w-xl w-full">
          <h2 className="text-4xl font-bold mb-4">Bienvenue {user?.username || ""}👋</h2>
          <p className="text-lg mb-6">Ceci est votre espace personnel.</p>
          
          {user?.role === 'admin' ? (
            <div className="bg-[rgb(246,233,215)] text-black p-6 rounded mb-6">
              <h3 className="text-2xl font-semibold mb-4">Page Admin</h3>
              <p className="mb-4">Vous êtes connecté en tant qu'administrateur.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[rgb(161,193,129)] p-4 rounded text-white">
                  <h4 className="font-bold">Gestion des utilisateurs</h4>
                  <p>Gérer les comptes utilisateurs</p>
                </div>
                <div className="bg-[rgb(161,193,129)] p-4 rounded text-white">
                  <h4 className="font-bold">Tableau de bord</h4>
                  <p>Voir les statistiques</p>
                </div>
                <div className="bg-[rgb(161,193,129)] p-4 rounded text-white">
                  <h4 className="font-bold">Configuration</h4>
                  <p>Modifier les paramètres</p>
                </div>
                <div className="bg-[rgb(161,193,129)] p-4 rounded text-white">
                  <h4 className="font-bold">Logs</h4>
                  <p>Consulter les journaux</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[rgb(246,233,215)] text-black p-6 rounded mb-6">
              <h3 className="text-2xl font-semibold mb-4">Espace Utilisateur</h3>
              <p className="mb-4">Vous êtes connecté en tant qu'utilisateur standard.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[rgb(161,193,129)] p-4 rounded text-white">
                  <h4 className="font-bold">Mon profil</h4>
                  <p>Modifier vos informations</p>
                </div>
                <div className="bg-[rgb(161,193,129)] p-4 rounded text-white">
                  <h4 className="font-bold">Mes préférences</h4>
                  <p>Gérer vos paramètres</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="mt-4 bg-[rgb(161,193,129)] hover:bg-[rgb(118,189,47)] text-white font-semibold py-2 px-6 rounded transition duration-200"
          >
            Se déconnecter
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Profile;