const { Sequelize } = require('sequelize'); // Importando
const connection = new Sequelize('usuariosl', 'root', 'Henrique=8801', {
    host:'localhost',
    dialect:'mysql'
});

module.exports = connection;