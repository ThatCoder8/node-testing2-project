const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../users/users-model');
const { JWT_SECRET } = require('../config');

router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'username and password required' });
    }

    const existingUser = await Users.findBy({ username }).first();
    if (existingUser) {
      return res.status(409).json({ message: 'username taken' });
    }

    const hash = bcrypt.hashSync(password, 8);
    const newUser = await Users.add({ username, password: hash });
    
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'username and password required' });
    }

    const user = await Users.findBy({ username }).first();
    if (!user) {
      return res.status(401).json({ message: 'invalid credentials' });
    }

    const passwordValid = bcrypt.compareSync(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ message: 'invalid credentials' });
    }

    const token = jwt.sign({
      subject: user.id,
      username: user.username
    }, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: `Welcome, ${user.username}!`,
      token
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
