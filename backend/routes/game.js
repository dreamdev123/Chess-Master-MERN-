const express = require('express');
const {
  matchData, gameMove, playGame, deleteGame,
} = require('../controller/game');
const {
  gameMoveValidation, playGameValidation, deleteGameValidation, validateGetGamesReq,
} = require('../validators/game');
const { runValidation } = require('../validators');

const router = express.Router();


router.get('/game/:_id?', validateGetGamesReq, runValidation, matchData);
//router.post('/game/move', gameMoveValidation, runValidation, gameMove);
router.post('/game/move', gameMove);
router.post('/game/play', playGameValidation, runValidation, playGame);
router.post('/game/deleteUnActiveGame', deleteGameValidation, runValidation, deleteGame);

module.exports = router;
