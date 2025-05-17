import React, {useState, useEffect} from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { Pencil, User, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
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

  
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-center text-[rgb(108,88,76)] mb-8">Mon Profil</h1>
            
            {loading ? (
              <div className="text-center py-10">Chargement...</div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-[rgb(108,88,76)] p-6 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-[rgb(161,193,129)] flex items-center justify-center text-white text-2xl">
                      {user.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <h2 className="text-2xl font-semibold text-white">{user?.username}</h2>
                  </div>
                  <button 
                    className="bg-[rgb(161,193,129)] hover:bg-[rgb(185,235,136)] transition-colors text-white rounded-lg p-2 flex items-center gap-2"
                    // onClick={() => alert("Fonctionnalité de modification")}
                  >
                    <Pencil size={18} />
                    <span>Modifier</span>
                  </button>
                </div>
                
                <div className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
                      <User className="text-[rgb(108,88,76)]" size={24} />
                      <div>
                        <p className="text-sm text-gray-500">Nom d'utilisateur</p>
                        <p className="text-lg font-medium">{user?.username}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
                      <Mail className="text-[rgb(108,88,76)]" size={24} />
                      <div>
                        <p className="text-sm text-gray-500">Adresse Email</p>
                        <p className="text-lg font-medium">{user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Phone className="text-[rgb(108,88,76)]" size={24} />
                      <div>
                        <p className="text-sm text-gray-500">Numéro de téléphone</p>
                        <p className="text-lg font-medium">{user?.number}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <Footer />
      </div>
    );
  };
  

export default Profile
