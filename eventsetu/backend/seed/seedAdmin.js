// Run with: node seed/seedAdmin.js
// Creates a default admin user for first-time setup.
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const email = 'admin@example.com';
  const exists = await User.findOne({ email });
  if (exists) {
    console.log('Admin already exists:', email);
  } else {
    await User.create({
      name: 'Admin',
      email,
      password: 'admin123',
      role: 'admin',
    });
    console.log('Admin created -> email: admin@example.com | password: admin123');
  }
  process.exit();
};

run();
