const ROLES = require('../constants/roles');

const controller = {};

// Listar los roles disponibles (para las listas desplegables del frontend)
controller.list = (req, res) => {
    res.json(Object.values(ROLES));
};

module.exports = controller;
