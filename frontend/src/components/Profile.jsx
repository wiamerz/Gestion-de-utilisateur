import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import "../index.css";
import { Pencil, User, Mail, Phone, X, Check, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    number: ''
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [originalEmail, setOriginalEmail] = useState('');

  useEffect(() => {
    // Récupération des données utilisateur depuis le localStorage
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        setUser(userData);
        setFormData({
          username: userData.username || '',
          email: userData.email || '',
          number: userData.number || ''
        });
        setOriginalEmail(userData.email || '');
      } catch (e) {
        console.error("Erreur lors de la récupération des données utilisateur:", e);
        toast.error("Erreur lors de la récupération des données utilisateur");
      }
    } else {
      toast.error("Utilisateur non connecté");
      navigate('/login');
    }
    setLoading(false);
  }, [navigate]);


  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.username.trim()) {
      newErrors.username = "Ce champ est obligatoire";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Ce champ est obligatoire";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
      isValid = false;
    }

    if (!formData.number.trim()) {
      newErrors.number = "Ce champ est obligatoire";
      isValid = false;
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.number)) {
      newErrors.number = "Numéro de téléphone invalide";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    try {
      // Si l'email a été modifié, nous devons passer par la vérification
      if (originalEmail !== formData.email) {
        const response = await axios.put('http://localhost:3000/api/auth/edit-profile', 
          { 
            ...formData,
            userId: user.id, 
            emailChanged: true
          },
          {
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (response.status === 200) {
          const updatedUser = { ...user, ...formData, isVerified: false };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
          
          toast.success("Profil mis à jour. Vérification d'email requise.");
          
          // Rediriger vers la page de vérification
          setTimeout(() => {
            navigate('/verification', { 
              state: { email: formData.email },
              search: `?email=${encodeURIComponent(formData.email)}`
            });
          }, 1500);
        }
      } else {
        // Mise à jour normale sans changement d'email
        const response = await axios.put('http://localhost:3000/api/auth/edit-profile', 
          { 
            ...formData,
            userId: user.id,
            emailChanged: true/false
          },
          {
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (response.status === 200) {
          // Mettre à jour les informations locales
          const updatedUser = { ...user, ...formData };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
          
          toast.success("Profil mis à jour avec succès");
          setIsEditing(false);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      const errorMessage = error.response?.data?.message || "Une erreur est survenue lors de la mise à jour du profil";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Réinitialiser les données du formulaire avec les valeurs de l'utilisateur
    setFormData({
      username: user.username || '',
      email: user.email || '',
      number: user.number || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[rgb(246,233,215)]">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-[rgb(108,88,76)] mb-8">Mon Profil</h1>
          
          {loading ? (
            <div className="text-center py-10">
              <Loader className="animate-spin mx-auto" size={36} />
              <p className="mt-4">Chargement...</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-[rgb(108,88,76)] p-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-[rgb(161,193,129)] flex items-center justify-center text-white text-2xl">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <h2 className="text-2xl font-semibold text-white">{user?.username}</h2>
                </div>
                
                {!isEditing ? (
                  <button 
                    className="bg-[rgb(161,193,129)] hover:bg-[rgb(185,235,136)] transition-colors text-white rounded-lg p-2 flex items-center gap-2"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil size={18} />
                    <span>Modifier</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      className="bg-gray-500 hover:bg-gray-600 transition-colors text-white rounded-lg p-2 flex items-center gap-2"
                      onClick={handleCancel}
                      disabled={isSaving}
                    >
                      <X size={18} />
                      <span>Annuler</span>
                    </button>
                    <button 
                      className={`bg-[rgb(161,193,129)] hover:bg-[rgb(185,235,136)] transition-colors text-white rounded-lg p-2 flex items-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? <Loader size={18} className="animate-spin" /> : <Check size={18} />}
                      <span>{isSaving ? 'Enregistrement...' : 'Enregistrer'}</span>
                    </button>
                  </div>
                )}
              </div>
              
              <div className="p-8">
                {!isEditing ? (
                  // Mode affichage
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
                        {user?.isVerified === false && (
                          <p className="text-sm text-red-500">Non vérifiée</p>
                        )}
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
                ) : (
                  // Mode édition
                  <div className="space-y-6">
                    <div className="flex gap-4 border-b border-gray-200 pb-4">
                      <User className="text-[rgb(108,88,76)] mt-8" size={24} />
                      <div className="flex-1">
                        <label className="text-sm text-gray-500">Nom d'utilisateur</label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          className={`w-full p-2 bg-gray-50 border rounded-lg text-black mt-1 ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                      </div>
                    </div>
                    
                    <div className="flex gap-4 border-b border-gray-200 pb-4">
                      <Mail className="text-[rgb(108,88,76)] mt-8" size={24} />
                      <div className="flex-1">
                        <label className="text-sm text-gray-500">Adresse Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full p-2 bg-gray-50 border rounded-lg text-black mt-1 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        {formData.email !== originalEmail && (
                          <p className="text-amber-600 text-sm mt-1">
                            Modification de l'email nécessitera une nouvelle vérification
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <Phone className="text-[rgb(108,88,76)] mt-8" size={24} />
                      <div className="flex-1">
                        <label className="text-sm text-gray-500">Numéro de téléphone</label>
                        <input
                          type="text"
                          name="number"
                          value={formData.number}
                          onChange={handleChange}
                          className={`w-full p-2 bg-gray-50 border rounded-lg text-black mt-1 ${errors.number ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;