const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET) {
    throw new Error('Falta la variable de entorno JWT_SECRET en el archivo .env');
}

// Nombre de la cookie donde viaja el JWT
const COOKIE_NAME = 'token';

const getExpiresHours = () => Number(process.env.JWT_EXPIRES_HOURS) || 8;

// Opciones de la cookie: httpOnly (no accesible desde JavaScript del navegador)
const cookieOptions = () => ({
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',   // en localhost (http) debe ser false
    path: '/'
});

// Firma el JWT con el id del usuario y su rol
const signToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: getExpiresHours() + 'h' });

// Verifica el JWT; lanza un error si es inválido o expiró
const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

const setTokenCookie = (res, token) => {
    res.cookie(COOKIE_NAME, token, { ...cookieOptions(), maxAge: getExpiresHours() * 60 * 60 * 1000 });
};

const clearTokenCookie = (res) => {
    res.clearCookie(COOKIE_NAME, cookieOptions());
};

module.exports = { COOKIE_NAME, signToken, verifyToken, setTokenCookie, clearTokenCookie };
