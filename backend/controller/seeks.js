const Seek = require('../models/seeks');
const Game = require('../models/game');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.allMatches = (req, res) => {
  const { userId } = req.params;
  Game.find({ withFriend: false, startedBy: { $ne: userId }, playerTwo: { $ne: userId } }).exec((err, games) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err),
      });
    }
    return res.json(games);
  });
};
exports.newUser = (req, res) => {
  const { userId } = req.body;
  Seek.findOne({ userId }).exec((err, seeker) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err),
      });
    }
    if (seeker) {
      return res.status(400).json({
        err: 'User already exist! Please create new User....',
      });
    }
    if (!seeker) {
      const newSeeker = new Seek({ userId });
      newSeeker.save((newErr, resSeeker) => {
        if (newErr) {
          return res.status(400).json({
            err: errorHandler(newErr),
          });
        }
        return res.json(resSeeker);
      });
    }
  });
};
exports.newMatches = (req, res) => {
  const { userId, color } = req.body;
  Seek.findOne({ userId }).exec((err, seeker) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err),
      });
    }
    if (!seeker) {
      const newSeeker = new Seek({ userId });
      return newSeeker.save((newErr, resSeeker) => {
        if (newErr) {
          return res.status(400).json({
            err: errorHandler(newErr),
          });
        }
      });
    }
    const game = new Game({ playerOne: userId, startedBy: userId, [color]: userId });
    game.save((newErr, newGame) => {
      if (err) {
        return res.status(400).json({
          err: errorHandler(newErr),
        });
      }
      return res.json(newGame);
    });
  });
};
exports.playWithFriend = (req, res) => {
  const { friendId, userId } = req.body;
  Seek.findOne({ userId: friendId }).exec((err, friend) => {
    if (!friend) {
      return res.status(400).json({
        err: 'there is no user with this id',
      });
    }
    if (friend) {
      const game = new Game({ playerOne: userId, friendId, withFriend: true });
      game.save((error, newGame) => {
        if (err) {
          return res.status(400).json({
            err: errorHandler(error),
          });
        }
        return res.json(newGame);
      });
    }
  });
};
exports.playWithFriendRequests = (req, res) => {
  const { userId } = req.params;
  Game.find({ $or: [{ withFriend: true, friendId: userId }, { withFriend: true, startedBy: userId }] }).exec((err, games) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err),
      });
    }
    res.json(games);
  });
};

exports.allUserGames = (req, res) => {
  const { userId } = req.params;

  Game.find({ $or: [{ startedBy: userId, withFriend: false }, { playerOne: userId, withFriend: false }, { playerTwo: userId, withFriend: false }] }).exec((err, games) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err),
      });
    }
    res.json(games);
  });
};
