// app.js
const express = require('express');
const app = express();
const pool = require('../db'); // Assuming you have a database connection setup

app.use(express.json());

// Router
const router = express.Router();

// Create
router.post('/game_user', async (req, res) => {
  try {
    const { user_id, result, time, game_number, game_title } = req.body;
    const newGameUser = await pool.query(
      'INSERT INTO game_user (user_id, result, time, game_number, game_title) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, result, time, game_number, game_title]
    );
    res.json(newGameUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({error:error.message});
  }
});


// Read
router.get('/game_user', async (req, res) => {
  try {
    const gameUsers = await pool.query('SELECT * FROM game_user');
    res.json(gameUsers.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({error:error.message});
  }
});
// Read
router.get('/game_user/all', async (req, res) => {
  try {
    const gameUsers = await pool.query('SELECT * FROM game_user ORDER BY game_number');
    const Users = await pool.query('SELECT * FROM users');
    for (let i = 0; i < Users.length; i++) {
    Users[i].user_game=[]
    for (let j = 0; j < gameUsers.length; j++) {
    if(Users[i].id==gameUsers[j].user_id){
Users[i].user_game.push(gameUsers[j])
    }
     }
    }
    res.json(gameUsers.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({error:error.message});
  }
});

// Update
router.put('/game_user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, result, time, game_number, game_title } = req.body;
    const updatedGameUser = await pool.query(
      'UPDATE game_user SET user_id = $1, result = $2, time = $3, game_number = $4, game_title = $5, time_update = current_timestamp WHERE id = $6 RETURNING *',
      [user_id, result, time, game_number, game_title, id]
    );
    res.json(updatedGameUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({error:error.message});
  }
});

// Delete
router.delete('/game_user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGameUser = await pool.query(
      'DELETE FROM game_user WHERE id = $1 RETURNING *',
      [id]
    );
    res.json(deletedGameUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({error:error.message});
  }
});



module.exports=router