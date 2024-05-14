const { check, param } = require('express-validator');

exports.newUserValidation = [
  check('userId')
    .not()
    .isEmpty()
    .withMessage('user id is required')
    .isString()
    .withMessage('is string')
    .isLength({ min: 5 })
    .withMessage('must be at least 5 letters long'),
];
exports.validateGetSeeksReq = [
  param('userId')
    .not()
    .isEmpty()
    .withMessage('user id is required')
    .isString()
    .withMessage('userId must be a string string'),
];
exports.newMatchesValidation = [
  check('userId')
    .not()
    .isEmpty()
    .withMessage('user id is required')
    .isString()
    .withMessage('is string')
    .isLength({ min: 5 })
    .withMessage('must be at least 5 letters long'),
  check('color')
    .not()
    .isEmpty()
    .withMessage('the color is required')
];
exports.playWithFriendValidation = [
  check('friendId')
    .not()
    .isEmpty()
    .withMessage('friendId id is required')
    .isString()
    .withMessage('is string')
    .isLength({ min: 5 })
    .withMessage('friendId must be at least 5 letters long'),
  check('userId')
    .not()
    .isEmpty()
    .withMessage('userId id is required')
    .isString()
    .withMessage('is string')
    .isLength({ min: 5 })
    .withMessage('userId must be at least 5 letters long'),
];
