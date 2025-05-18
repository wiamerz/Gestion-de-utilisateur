import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import '../index.css'
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Password = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { token } = useParams();
  const [password, setPassword] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post("http://localhost:3000/api/auth/reset-password", { token, password });
        toast.success("Mot de passe réinitialisé !");
      } catch (error) {
        toast.error("Erreur : " + error.response?.data?.message);
      }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[rgb(108,88,76)]">Réinitialisation du mot de passe</h1>
          <p className="mt-2 text-gray-600">Veuillez entrer votre nouveau mot de passe</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="space-y-6">
              {/* Champ de mot de passe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg"
                    placeholder="********"
                    
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={18} className="text-gray-400" />
                    ) : (
                      <Eye size={18} className="text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Au moins 8 caractères, une majuscule, une minuscule et un chiffre
                </p>
              </div>

              {/* Champ de confirmation du mot de passe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg"
                    placeholder="********"
                    
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} className="text-gray-400" />
                    ) : (
                      <Eye size={18} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-[rgb(161,193,129)] hover:bg-green-500 transition-colors text-white font-medium rounded-lg"
              >
                Réinitialiser le mot de passe
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Vous vous souvenez de votre mot de passe ?{' '}
        
         <a href="/login" className="text-[rgb(108,88,76)] font-medium cursor-pointer hover:underline"> Connexion</a>
            
          </p>
        </div>
      </div>
    </div>
  );
};

export default Password;