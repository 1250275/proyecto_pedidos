const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 8;

// Valida que la contraseña sea texto con la longitud mínima
const isValidPassword = (password) => typeof password === 'string' && password.length >= MIN_PASSWORD_LENGTH;

const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);

const comparePassword = (password, hash) => bcrypt.compare(password, hash);

module.exports = { MIN_PASSWORD_LENGTH, isValidPassword, hashPassword, comparePassword };
