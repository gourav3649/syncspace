const prisma = require('../prismaClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check if user exists
    const userExists = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (userExists) {
      return res.status(409).send('E-mail already in use.');
    }

    // encrypt password
    const encryptedPassword = await bcrypt.hash(password, 10);

    const saalik = await prisma.user.findUnique({
      where: { email: 'salikmubien@gmail.com' },
    });

    // create user document and save in database
    const user = await prisma.user.create({
      data: {
        username,
        email: email.toLowerCase(),
        password: encryptedPassword,
        friends: saalik ? { connect: [{ id: saalik.id }] } : undefined,
      },
    });

    if (saalik) {
      await prisma.user.update({
        where: { id: saalik.id },
        data: { friends: { connect: [{ id: user.id }] } }
      });
    }

    // create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '15d',
      }
    );

    res.status(201).json({
      userDetails: {
        _id: user.id,
        email: user.email,
        token: token,
        username: user.username,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error occurred. Please try again');
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res
        .status(400)
        .send('Invalid credentials. Please try again');
    }

    const passwordsMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordsMatch) {
      return res
        .status(400)
        .send('Invalid credentials. Please try again');
    }

    // send new token
    const token = jwt.sign(
      {
        userId: user.id,
        email,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '15d',
        // expiresIn: 60,
      }
    );

    return res.status(200).json({
      userDetails: {
        _id: user.id,
        email: user.email,
        token: token,
        username: user.username,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send('Something went wrong. Please try again');
  }
};

const subscribe = async (req, res) => {
  const { endpoint, keys } = req.body;
  const user = req.user;

  console.log(req.body);

  const userDoc = await prisma.user.findUnique({
    where: { id: user.userId },
    include: { pushSubscriptions: true }
  });

  if (!userDoc) {
    return res.status(404).send('User not found');
  }

  try {
    const existingSubscription = userDoc.pushSubscriptions.find(
      (sub) => sub.endpoint === endpoint
    );

    if (existingSubscription) {
      return res.status(200).send('Subscription already exists');
    }
  } catch (err) {
    return res
      .status(500)
      .send('Something went wrong while saving the subscription');
  }

  try {
    await prisma.pushSubscription.create({
      data: {
        userId: userDoc.id,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
      }
    });
  } catch (err) {
    return res
      .status(500)
      .send('Something went wrong while saving the subscription');
  }

  res.status(200).send('Subscription saved');
};

const unsubscribe = async (req, res) => {
  const { endpoint } = req.body;
  const user = req.user;

  console.log(req.body);

  const userDoc = await prisma.user.findUnique({
    where: { id: user.userId },
    include: { pushSubscriptions: true }
  });

  if (!userDoc) {
    return res.status(404).send('User not found');
  }

  const subscription = userDoc.pushSubscriptions.find(
    (sub) => sub.endpoint === endpoint
  );

  if (!subscription) {
    return res.status(404).send('Subscription not found');
  }

  try {
    await prisma.pushSubscription.delete({
      where: { id: subscription.id }
    });
  } catch (err) {
    return res
      .status(500)
      .send('Something went wrong while removing the subscription');
  }

  console.log('Subscription removed');

  res.status(200).send('Subscription removed');
};

module.exports = {
  login,
  register,
  subscribe,
  unsubscribe,
};
