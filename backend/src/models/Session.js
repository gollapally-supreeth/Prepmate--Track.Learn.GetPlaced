const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Adjust path if needed

const Session = sequelize.define('Session', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  ended: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'interview',
  },
  // Add other fields as needed
});

module.exports = Session; 