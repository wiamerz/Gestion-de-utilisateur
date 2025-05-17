require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./Routes/authRoutes');

const app = express();

// Middlewares
app.use(cors()); 
app.use(bodyParser.json());

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/authentification';
mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); 
  });

// Routes
app.use('/api/auth', authRoutes);

// 404 route
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found'});
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  
  // Afficher les paramètres de configuration au démarrage
  console.log('📧 Configuration Email:');
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    console.log('✅ EMAIL_USER et EMAIL_PASS configurés');
  } else {
    console.log('❌ Configuration email incomplète:');
    if (!process.env.EMAIL_USER) console.log('   EMAIL_USER manquant dans .env');
    if (!process.env.EMAIL_PASS) console.log('   EMAIL_PASS manquant dans .env');
  }
});