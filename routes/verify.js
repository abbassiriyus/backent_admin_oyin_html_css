// app.js
const express = require('express');
const app = express();
const pool = require('./db'); // Assuming you have a database connection setup

app.use(express.json());

// Router
const router = express.Router();

// Create
router.post('/verify', async (req, res) => {
  try {
    const { code, email } = req.body;
    const newVerification = await pool.query(
      'INSERT INTO verify (code, email) VALUES ($1, $2) RETURNING *',
      [code, email]
    );
    res.json(newVerification.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Read
router.get('/verify', async (req, res) => {
  try {
    const verifications = await pool.query('SELECT * FROM verify');
    res.json(verifications.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update
router.put('/verify/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { code, email } = req.body;
    const updatedVerification = await pool.query(
      'UPDATE verify SET code = $1, email = $2, time_update = current_timestamp WHERE id = $3 RETURNING *',
      [code, email, id]
    );
    res.json(updatedVerification.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete
router.delete('/verify/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVerification = await pool.query(
      'DELETE FROM verify WHERE id = $1 RETURNING *',
      [id]
    );
    res.json(deletedVerification.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports=router