const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
    const user = new User({ username, email, password, number, role });
    console.log('User object before saving:', user); 

      await user.save()
      
      res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
    
  } catch (error) {
    console.error('Erreur serveur:', error); 
    res.status(500).json({ message: 'Erreur serveur, veuillez réessayer plus tard' });
  }
};




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

module.exports = { register, login };
