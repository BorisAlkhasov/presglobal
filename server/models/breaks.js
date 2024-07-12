const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Breaks = sequelize.define(
  'Breaks',
  {
    break_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    shift_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'breaks',
    timestamps: true,
  }
);

module.exports = Breaks;
