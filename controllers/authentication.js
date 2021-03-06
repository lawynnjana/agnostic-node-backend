const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  // iat = issued at time
  // sub = subject
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {

    // user's email and password are auth'd
    // give them a token
    res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next){
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password)
    res.status(422).send({ error: 'You must provide an email and password'});
  
    User.findOne({ email: email }, function(err, existingUser) {
    if(err) return next(err);

    if(existingUser)
      return res.status(422).send({ error: 'Email is in use' });
  });

  // If a user with email does NOT exist, create and save user record
  const user = new User({
    email: email,
    password: password
  }) 

  user.save(function(err) {
    if(err) return next(err);

    // respond with an indentification token on success
    res.send({ token: tokenForUser(user)});
  });
};
