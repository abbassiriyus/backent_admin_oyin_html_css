const express = require('express');
const app = express();
const pool = require('./db'); // Assuming you have a database connection setup

app.use(express.json());

// Router
const router = express.Router();

// Create
router.post('/random_account_image', async (req, res) => {
  try {
    const { image } = req.body;
    const newImage = await pool.query(
      'INSERT INTO random_account_image (image) VALUES ($1) RETURNING *',
      [image]
    );
    res.json(newImage.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Read
router.get('/random_account_image', async (req, res) => {
  try {
    const images = await pool.query('SELECT * FROM random_account_image');
    res.json(images.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update
router.put('/random_account_image/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { image } = req.body;
    const updatedImage = await pool.query(
      'UPDATE random_account_image SET image = $1, time_update = current_timestamp WHERE id = $2 RETURNING *',
      [image, id]
    );
    res.json(updatedImage.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete
router.delete('/random_account_image/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedImage = await pool.query(
      'DELETE FROM random_account_image WHERE id = $1 RETURNING *',
      [id]
    );
    res.json(deletedImage.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports=router