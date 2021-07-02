'use strict';

const auth = require('basic-auth');
const { User } = require('../models');
const bcrypt = require('bcrypt');

/**
 * Middleware to authenticate the request using Basic Authentication.
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @param {Function} next - The function to call to pass execution to the next middleware.
 */
exports.authenticateUser = async (req, res, next) => {
  let message;
  console.log(`In auth-user.js req  = ${req.headers.authorization}`);
  const credentials = auth(req);
  console.log(`In auth-user.js credentials = ${credentials.pass}`);

  if (credentials) {
    const user = await User.findOne({ where: {emailAddress: credentials.name} });
    console.log(`sooooo ${Object.keys(user.dataValues)}`);
    if (user) {
      const authenticated = bcrypt
        .compareSync(credentials.pass, user.password); 
      if (authenticated) {
        console.log(`Authentication successful for user with Email: ${user.emailAddress}`);

        // Store the user on the Request object.
        req.currentUser = user;
      } else {
        message = `Authentication failure for user with email: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for user with email: ${credentials.emailAddress}`;
    }
  } else {
    message = 'Auth header not found';
  }

  if (message) {
    console.warn(message);
    res.status(401).json({ message: 'Access Denied' });
  } else {
    next();
  }
};