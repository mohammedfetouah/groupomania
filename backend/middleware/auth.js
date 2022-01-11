const jwt = require('jsonwebtoken');
const app = require('../app');





module.exports = (req, res, next) => {
  try {
    console.log(req.headers.authorization);
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;


    http://google.fr/post/5?userId=1
    req.params.lol = 5
    req.query.userId = 1
    req.query.limit = 1
    req.query.sort = 'desc' 
    if (!req.query.userId || parseInt(req.query.userId) !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch(error) {
    console.log(error)
    res.status(401).json({
      error: 'Erreur server'
    });
  }
};
