import React, { useState, useEffect } from 'react';
import '../index.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Verification = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract email from URL parameters or state
  const email = new URLSearchParams(location.search).get('email') || 
                (location.state && location.state.email) || '';
  
  const handleVerify = async () => {
    if (code.length !== 6) {
      setError('Veuillez entrer un code à 6 chiffres');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:3000/api/auth/verify-email', {
        email,
        code
      });
      
      if (response.data.message) {
        setSuccess(response.data.message);
        toast.success("Votre compte a été vérifié avec succès!");
        
        // Wait 2 seconds before redirecting to login
        setTimeout(() => {
          navigate('/login', { state: { verificationSuccess: true } });
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la vérification');
      toast.error(err.response?.data?.message || 'Échec de la vérification');
    } finally {
      setLoading(false);
    }
  };
  
  const handleResendCode = async () => {
    if (!email) {
      setError('Email introuvable. Veuillez réessayer.');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/auth/resend-verification', { email });
      setSuccess('Un nouveau code a été envoyé à votre adresse email');
      toast.success('Code de vérification renvoyé!');
    } catch (err) {
      setError("Échec de l'envoi du code. Veuillez réessayer.");
      toast.error("Échec de l'envoi du code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen overflow-x-hidden bg-[rgb(246,233,215)]">
      <div className="bg-[rgb(108,88,76)] gap-6 m-5 p-8 max-w-md w-full text-white rounded-3xl shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-6">Vérification Email</h1>
        
        {!email ? (
          <p className="text-center font-medium mb-4 text-red-300">
            Aucune adresse email fournie. Veuillez retourner à la page d'inscription.
          </p>
        ) : (
          <>
            <p className="mt-4 mb-6 text-center font-light">
              Nous avons envoyé un code de vérification à <strong>{email}</strong>. 
              Veuillez vérifier votre boîte de réception et entrer le code ci-dessous.
            </p>
            
            {error && <div className="bg-red-500 bg-opacity-20 text-red-200 p-3 rounded-lg mb-4 text-center">{error}</div>}
            {success && <div className="bg-green-500 bg-opacity-20 text-green-200 p-3 rounded-lg mb-4 text-center">{success}</div>}
            
            <h2 className="text-xl text-center font-medium mb-3">Entrez le code de confirmation</h2>
            
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
              placeholder="000000"
              className="text-black text-xl tracking-widest bg-amber-50 block mx-auto rounded-lg text-center h-14 w-full max-w-xs mb-6"
              type="text" 
              maxLength={6}
            />
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleVerify}
                disabled={loading || code.length !== 6}
                className="bg-[rgb(161,193,129)] hover:bg-[rgb(185,235,136)] rounded-lg py-3 px-6 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Vérification...' : 'Vérifier'}
              </button>
              
              <button 
                onClick={handleResendCode}
                disabled={loading}
                className="text-amber-50 hover:text-white underline py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Renvoyer le code
              </button>
            </div>
          </>
        )}
      </div>
    </div>


  );
};

export default Verification;