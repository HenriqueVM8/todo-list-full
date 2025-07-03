const { Sequelize } = require('sequelize'); // Importando Sequelize
const connection = require('./datatbase'); // Importando database.js

const Usersl = connection.define('usersl', {
    user:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

Usersl.sync({ force: false }).then(() => {});

module.exports = Usersl;