const { check, param } = require('express-validator');

exports.validateGetGamesReq = [
  param('_id')
    .not()
    .isEmpty()
    .withMessage('_id is required')
    .isString()
    .withMessage('_Id must be a string string'),
];
exports.gameMoveValidation = [
  check('id')
    .not()
    .isEmpty()
    .withMessage('id is required')
    .isString()
    .withMessage('it must be string'),
  check('gameFen')
    .not()
    .isEmpty()
    .withMessage('gameFen is required')
    .isString()
    .withMessage('it must be string'),
];
exports.playGameValidation = [
  check('id')
    .not()
    .isEmpty()
    .withMessage('id is required')
    .isString()
    .withMessage('id must be string'),
  check('playerTwo')
    .not()
    .isEmpty()
    .withMessage('playerTwo is required')
    .isString()
    .withMessage('it must be string'),
];
exports.deleteGameValidation = [
  check('id')
    .not()
    .isEmpty(),
  check('userId')
    .not()
    .isEmpty(),
];
