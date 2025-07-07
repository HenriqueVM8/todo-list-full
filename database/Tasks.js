const { DataTypes } = require('sequelize');
const connection = require('./datatbase');
const Users = require('./TableUsers');

const Task = connection.define('task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  done: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

// Relacionamento 1:N
Task.belongsTo(Users, { foreignKey: 'userId' });
Users.hasMany(Task, { foreignKey: 'userId' });

module.exports = Task;