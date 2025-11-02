const mongoose = require('mongoose');
const { urlDb } = require('../config');

mongoose.set('strictQuery', true);

mongoose.connect(urlDb)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ Connection error:', err.message));

const db = mongoose.connection;
module.exports = db;
