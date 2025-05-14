import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../provider/AuthProvider';
import toast from 'react-hot-toast';

const LoginForm = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const [apiError, setApiError] = useState('');

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    if (!formData.email.trim()) {
      newErrors.email = 'Ce champ est obligatoire';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format invalide';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Ce champ est obligatoire';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', formData, {
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.data.token) {
          const { token, user } = response.data;
          
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          
          setToken(token); 
          
          toast.success("connexion réussie ", {duration: 2000})
          setTimeout(() => {
            
            navigate('/profile');
          }, 3000);
        }
      } catch (error) {
        setApiError(error.response?.data?.message || 'Erreur lors de la connexion');
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[rgb(108,88,76)] flex flex-col justify-center items-center px-4">

      <h1 className="text-4xl md:text-5xl text-white font-bold mb-8 px-6 py-4 rounded-lg">
        Open this 9fol
      </h1>

      <div className="bg-[rgb(246,233,215)] p-8 md:p-12 rounded-lg shadow-2xl max-w-md w-full">
        <h2 className="text-2xl font-bold text-black mb-6 text-center">Connexion</h2>

        {apiError && <p className="text-red-500 text-center mb-4">{apiError}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-black mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border-b bg-[rgb(252,243,231)] text-black border-black rounded-lg"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label className="block mb-1 text-black font-medium">Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border-b bg-[rgb(252,243,231)] border-black text-black rounded-lg"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <button type="submit" className="w-full bg-[rgb(161,193,129)] hover:bg-[rgb(118,189,47)] text-white p-2 rounded-lg">
            Se connecter
          </button>
        </form>

        <p className="text-center text-black mt-4">
          Pas encore de compte ? <a href="/registre" className="text-[rgb(161,193,129)]">Créer un compte</a>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;