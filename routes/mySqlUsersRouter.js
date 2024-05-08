const express = require('express');
const router = express.Router();
const pool = require('../db'); // Assuming you have a database connection setup
const { upload_image, delete_image } = require('../middlewere/file_upload');

router.post('/users', (req, res) => {
    const { fullname, email, year, sinf, password } = req.body;
    upload_image(req)
      .then(image => {
        pool.query(
          'INSERT INTO users (fullname, email, image, year, sinf, password) VALUES (?, ?, ?, ?, ?, ?) RETURNING *',
          [fullname, email, image, year, sinf, password],
          function (err, result, fields) {
            if (err) {
              console.error(err.message);
              res.status(500).json({ error: err.message });
            } else {
              res.json(result[0]);
            }
          }
        );
      })
      .catch(err => {
        console.error(err.message);
        res.status(500).json({ error: err.message });
      });
  });
router.post('/users/admin', (req, res) => {
    const { fullname, email, year, sinf, password } = req.body;
    const type = 1;
    upload_image(req)
      .then(image => {
        pool.query(
          'INSERT INTO users (fullname, email, image, year, sinf, password, type) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *',
          [fullname, email, image, year, sinf, password, type],
          function (err, result, fields) {
            if (err) {
              console.error(err.message);
              res.status(500).json({ error: err.message });
            } else {
              res.json(result[0]);
            }
          }
        );
      })
      .catch(err => {
        console.error(err.message);
        res.status(500).json({ error: err.message });
      });
  });

router.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
  
    const query = 'SELECT * FROM users WHERE email = ?';
    pool.execute(query, [email], function (err, result, fields) {
      if (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        const rows = result[0];
  
        if (rows.length > 0 && rows[0].password === password) {
          res.json(rows[0]); // Send the user object
        } else {
          res.status(401).json({ error: 'Invalid email or password' });
        }
      }
    });
  });
  
  router.get('/users', (req, res) => {
    try {
      const query = 'SELECT * FROM users';
      pool.query(query, function (err, result, fields) {
        if (err) {
          console.error(err.message);
          res.status(500).json({ error: err.message });
        } else {
          res.json(result);
        }
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: err.message });
    }
  });
  
  router.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM users WHERE id = ?';
    pool.execute(query, [id], function (err, result, fields) {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
      } else {
        const rows = result[0];
        res.json(rows[0]);
      }
    });
  });
  
router.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { fullname, email, year, sinf } = req.body;
    let image = null;
  
    if (req.body.image || req.files.image) {
      pool.query('SELECT * FROM users WHERE id = ?', [id], function (err, user, fields) {
        if (user.length > 0 && user[0].image) {
          delete_image(user[0].image); // Delete the previous image
        }
        upload_image(req)
          .then(newImage => {
            image = newImage;
            updateUserData();
          })
          .catch(err => {
            console.error(err.message);
            res.status(500).json({ error: err.message });
          });
      });
    } else {
      updateUserData();
    }
  
    function updateUserData() {
      pool.query(
        'UPDATE users SET fullname = ?, email = ?, image = ?, year = ?, sinf = ? WHERE id = ?',
        [fullname, email, image, year, sinf, id],
        function (err, result, fields) {
          if (err) {
            console.error(err.message);
            res.status(500).json({ error: err.message });
          } else {
            res.json(result[0]);
          }
        }
      );
    }
  });
  
  router.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    pool.query('SELECT * FROM users WHERE id = ?', [id], function (err, user, fields) {
      if (user.length > 0 && user[0].image) {
        delete_image(user[0].image); // Delete the user's image
      }
      pool.query('DELETE FROM users WHERE id = ?', [id], function (err, result, fields) {
        if (err) {
          console.error(err.message);
          res.status(500).json({ error: err.message });
        } else {
          res.json(result[0]);
        }
      });
    });
  });
module.exports = router;