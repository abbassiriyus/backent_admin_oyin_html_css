
const express = require('express');
const router = express.Router();
const pool = require('../db'); // Assuming you have a database connection setup
const { put_image, delete_image, upload_image } = require('../middlewere/file_upload');

// Create a new user
router.post('/users', async (req, res) => {
  try {
    const { fullname, email, year, sinf,password } = req.body;
  var image=upload_image(req)
    const newUser = await pool.query(
      'INSERT INTO users (fullname, email, image, year, sinf,password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [ fullname, email, image, year, sinf, password]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Query the users table
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(query, [email]);

    // Check if user exists and password is correct
    if (rows.length > 0 && rows[0].password === password) {
      res.json(rows[0]); // Send the user object
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const allUsers = await pool.query('SELECT * FROM users');
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a user by ID
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, fullname, email, image, year, sinf,password } = req.body;
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
put_image(user[0].image,req)
    const updatedUser = await pool.query(
      'UPDATE users SET type = $1, fullname = $2, email = $3, image = $4, year = $5, sinf = $6,password=$7, time_update = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *',
      [type, fullname, email, image, year, sinf,password, id]
    );
    res.json(updatedUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a user by ID
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    delete_image(user[0].image)
    const deletedUser = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    res.json(deletedUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;