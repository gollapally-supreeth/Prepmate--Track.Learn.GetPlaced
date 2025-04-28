const { DataTypes } = require('sequelize');
const sequelize = require('../../db'); // Adjust path if your sequelize instance is elsewhere

const Test = sequelize.define('Test', {
  subject: { type: DataTypes.STRING, allowNull: false },
  topics: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
  subtopics: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
  questionType: { type: DataTypes.STRING, allowNull: false },
  difficulty: { type: DataTypes.STRING, allowNull: false },
  numberOfQuestions: { type: DataTypes.INTEGER, allowNull: false },
  timePerQuestion: { type: DataTypes.INTEGER, allowNull: true },
  includeExplanations: { type: DataTypes.BOOLEAN, defaultValue: true },
  questions: { type: DataTypes.JSONB, allowNull: false },
  userId: { type: DataTypes.STRING, allowNull: true },
}, {
  timestamps: true,
});

module.exports = Test; 