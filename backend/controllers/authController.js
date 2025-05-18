const User = require('../Models/User'); 
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Store verification codes (in memory - consider using Redis or database for production)
const verificationCodes = {};

// Send verification code
const sendVerificationCode = async (email) => {
  // Generate a 6-digit verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store code with expiration (30 minutes)
  verificationCodes[email] = {
    code,
    expiresAt: Date.now() + 30 * 60 * 1000 // 30 minutes
  };
  
  // Check if email configuration is available
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Configuration email manquante (EMAIL_USER ou EMAIL_PASS non défini dans .env)');
    throw new Error('Configuration email incorrecte');
  }
  
  // Configure email transporter
  const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Votre code de vérification",
    text: `Bonjour ! Voici votre code de vérification : ${code}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #6c584c; text-align: center;">Vérification de votre compte</h2>
        <p style="margin: 20px 0;">Merci de vous être inscrit. Pour valider votre compte, veuillez utiliser le code suivant :</p>
        <div style="background-color: #f6e9d7; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 5px; margin: 20px 0;">
          ${code}
        </div>
        <p style="color: #666; font-size: 14px; text-align: center;">Ce code expirera dans 30 minutes.</p>
      </div>
    `
  };
  
  // Send email
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email sending error:", error);
        reject(error);
      } else {
        console.log("Email sent:", info.response);
        resolve(info);
      }
    });
  });
};



// Register function
const register = async (req, res) => {
  console.log('Requête reçue:', req.body);
  try {
    const { username, email, password, confirmPassword, number, role} = req.body;
    
    if (!username || !email || !password || !confirmPassword || !number || !role ) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    
    // Create user with verified status set to false
    const user = new User({ 
      username, 
      email, 
      password, 
      number, 
      role,
      isVerified: false 
    });
    
    console.log('User object before saving:', user);
    await user.save();
    
    // Send verification code
    try {
      await sendVerificationCode(email);
      res.status(201).json({ 
        message: 'Utilisateur enregistré avec succès. Veuillez vérifier votre email.',
        email: email,
        needsVerification: true
      });
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi du code de vérification:', emailError);
      res.status(201).json({ 
        message: 'Utilisateur enregistré, mais impossible d\'envoyer l\'email de vérification. Veuillez vérifier votre configuration EMAIL_USER et EMAIL_PASS dans le fichier .env',
        email: email
      });
    }
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ message: 'Erreur serveur, veuillez réessayer plus tard' });
  }
};

// Verify email function
const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({ message: 'Email et code requis' });
    }
    
    // Check if verification code exists and is valid
    if (!verificationCodes[email] || 
        verificationCodes[email].code !== code || 
        verificationCodes[email].expiresAt < Date.now()) {
      
      return res.status(400).json({ 
        message: !verificationCodes[email] ? 'Code non trouvé.' : 
                (verificationCodes[email].expiresAt < Date.now() ? 'Code expiré.' : 'Code incorrect.') 
      });
    }
    
    // Mark user as verified
    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Remove verification code
    delete verificationCodes[email];
    
    // Return success
    res.status(200).json({ message: 'Email vérifié avec succès' });
    
  } catch (error) {
    console.error('Erreur de vérification:', error);
    res.status(500).json({ message: 'Erreur serveur, veuillez réessayer plus tard' });
  }
};

// Resend verification code
const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    if (user.isVerified) {
      return res.status(400).json({ message: 'Cet email est déjà vérifié' });
    }
    
    // Send verification code
    try {
      await sendVerificationCode(email);
      res.status(200).json({ message: 'Code de vérification envoyé' });
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi du code de vérification:', emailError);
      res.status(500).json({ 
        message: 'Impossible d\'envoyer l\'email de vérification. Veuillez vérifier votre configuration EMAIL_USER et EMAIL_PASS dans le fichier .env'
      });
    }
    
  } catch (error) {
    console.error('Erreur de renvoi du code:', error);
    res.status(500).json({ message: 'Erreur serveur, veuillez réessayer plus tard' });
  }
};

/////////////////////////////////////////////////////////////



// Edit profile route 
const editProfile = async (req, res) => {
  try {
    const { userId, username, email, number, emailChanged } = req.body;
    
    if (!userId || !username || !email || !number) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    
    // Vérifier que l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Vérifier si l'email a changé et s'il n'est pas déjà utilisé par un autre utilisateur
    if (email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé par un autre compte' });
      }
    }
    
    // Mise à jour conditionnelle selon si l'email a changé
    const updateData = {
      username,
      number,
      email
    };
    
    // Si l'email a changé, marquer comme non vérifié et envoyer un code de vérification
    if (emailChanged && email !== user.email) {
      updateData.isVerified = false;
      
      // Mettre à jour l'utilisateur avec le nouvel email non vérifié
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
      );
      
      // Envoyer un code de vérification pour le nouvel email
      try {
        await sendVerificationCode(email);
        return res.status(200).json({
          message: 'Profil mis à jour. Veuillez vérifier votre nouvel email.',
          user: {
            id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            number: updatedUser.number,
            isVerified: updatedUser.isVerified,
            role: updatedUser.role
          },
          needsVerification: true
        });
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi du code de vérification:', emailError);
        return res.status(200).json({
          message: 'Profil mis à jour, mais impossible d\'envoyer l\'email de vérification.',
          user: {
            id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            number: updatedUser.number,
            isVerified: updatedUser.isVerified,
            role: updatedUser.role
          },
          needsVerification: true
        });
      }
    } else {
      // Mise à jour normale sans changement d'email ou sans besoin de vérification
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
      );
      
      return res.status(200).json({
        message: 'Profil mis à jour avec succès',
        user: {
          id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          number: updatedUser.number,
          isVerified: updatedUser.isVerified,
          role: updatedUser.role
        }
      });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ message: 'Erreur serveur, veuillez réessayer plus tard' });
  }
};




/////////////////////////////////////////////////////////////

// Login function
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }
    
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }
    
    // Check if user is verified
    if (!user.isVerified) {
      // Send a new verification code
      try {
        await sendVerificationCode(email);
        return res.status(403).json({ 
          message: 'Email non vérifié. Un nouveau code de vérification a été envoyé.',
          needsVerification: true,
          email: user.email
        });
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi du code de vérification:', emailError);
        return res.status(403).json({ 
          message: 'Email non vérifié. Impossible d\'envoyer l\'email de vérification. Veuillez vérifier votre configuration EMAIL_USER et EMAIL_PASS dans le fichier .env',
          needsVerification: true,
          email: user.email
        });
      }
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ message: 'Erreur serveur, veuillez réessayer plus tard' });
  }
};

module.exports = { register, login, verifyEmail, resendVerificationCode, editProfile};