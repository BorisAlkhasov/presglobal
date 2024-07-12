const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Employee = sequelize.define(
  'Employee',
  {
    employee_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'employees',
    timestamps: true,
  }
);

module.exports = Employee;
