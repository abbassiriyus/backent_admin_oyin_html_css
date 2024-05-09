const express = require('express');
const app = express();
const connection = require('../db'); // Assuming you have a database connection setup

app.use(express.json());
const router = express.Router();

// Create
router.post('/game_user', (req, res) => {
    const { user_id, result, time, game_number, game_title } = req.body;
    try{
       const query = 'INSERT INTO game_user (user_id, result, time, game_number, game_title) VALUES (?, ?, ?, ?, ?)';
    const values = [user_id, result, time, game_number, game_title];
    connection.query(query, values, function (err, result, fields) {
      if (err) {
        console.error(err.message);
        res.status(500).send({ error: err.message });
      } else {
        res.json(result);
      }
    });   
    }catch(err){
        res.status(500).send({ error: err.message });
    }
  
  });
  
  // Read
  router.get('/game_user', (req, res) => {
    const query = 'SELECT * FROM game_user';
    connection.query(query, function (err, result, fields) {
      if (err) {
        console.error(err.message);
        res.status(500).send({ error: err.message });
      } else {
        res.json(result);
      }
    });
  });
  
  // Read with join
  router.get('/game_user/all', (req, res) => {
    const gameUsersQuery = 'SELECT * FROM game_user ORDER BY game_number';
    const usersQuery = 'SELECT * FROM users';
    connection.query(gameUsersQuery, function (err, gameUsers, fields) {
      if (err) {
        console.error(err.message);
        res.status(500).send({ error: err.message });
      } else {
        connection.query(usersQuery, function (err, users, fields) {
          if (err) {
            console.error(err.message);
            res.status(500).send({ error: err.message });
          } else {
            for (let i = 0; i < users.length; i++) {
              users[i].user_game = [];
              for (let j = 0; j < gameUsers.length; j++) {
                if (users[i].id == gameUsers[j].user_id) {
                  users[i].user_game.push(gameUsers[j]);
                }
              }
            }
            res.json(users);
          }
        });
      }
    });
  });
  
  // Update
  router.put('/game_user/:id', (req, res) => {
    const { id } = req.params;
    try{
       const { user_id, result, time, game_number, game_title } = req.body;
    const query = 'UPDATE game_user SET user_id = ?, result = ?, time = ?, game_number = ?, game_title = ?, time_update = current_timestamp WHERE id = ?';
    const values = [user_id, result, time, game_number, game_title, id];
    connection.query(query, values, function (err, result, fields) {
      if (err) {
        console.error(err.message);
        res.status(500).send({ error: err.message });
      } else {
        res.json(result);
      }
    });   
    }catch(err){
        res.status(500).send({ error: err.message }); 
    }
  
  });
  
  // Delete
  router.delete('/game_user/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM game_user WHERE id = ?';
    const values = [id];
    connection.query(query, values, function (err, result, fields) {
      if (err) {
        console.error(err.message);
        res.status(500).send({ error: err.message });
      } else {
        res.json(result);
      }
    });
  });
module.exports = router;