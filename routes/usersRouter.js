// userRouter.js
const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const pool=require("../db.js") 
const router = express.Router();


// Create a new user
router.post('/users', async (req, res) => {
  const { type, fullname, email, image, year, sinf} = req.body;

  try {
    const code = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit verification code
    const query = 'INSERT INTO users (type, fullname, email, image, year, sinf, verification_code) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const values = [type, fullname, email, image, year, sinf, code];
    const { rows } = await pool.query(query, values);
    await sendVerificationEmail(email, code);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(query, [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify the password (you'll need to implement this logic)
    if (!verifyPassword(rows[0].password, password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JSON Web Token
    const token = jwt.sign({ userId: rows[0].id }, 'your_secret_key', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Verify user email
router.post('/verify', async (req, res) => {
  const { email, code } = req.body;

  try {
    const query = 'UPDATE users SET is_verified = true WHERE email = $1 AND verification_code = $2 RETURNING *';
    const { rows } = await pool.query(query, [email, code]);

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    res.json({ message: 'Email verified' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error verifying email' });
  }
});

// Helper function to send verification email
async function sendVerificationEmail(email, code) {
  const transporter = nodemailer.createTransport({
    // Your email transport configuration
  });

  await transporter.sendMail({
    from: 'your_email@example.com',
    to: email,
    subject: 'Verify your email',
    text: `Your verification code is: ${code}`,
  });
}

// Helper function to verify password (you'll need to implement this)
function verifyPassword(hashedPassword, password) {
  // Implement your password verification logic here
  return true;
}

module.exports = router;