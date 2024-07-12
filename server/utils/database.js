const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: 'mysql',
  host: process.env.DB_HOST,
});

exports.sequelize = sequelize;

const Employee = require('../models/employees');
const Shift = require('../models/shifts');
const Breaks = require('../models/breaks');

Shift.hasMany(Breaks, { foreignKey: 'shift_id' });
Breaks.belongsTo(Shift, { foreignKey: 'shift_id' });

exports.Employees = Employee;
exports.Shifts = Shift;
exports.Breaks = Breaks;

exports.createDatabase = async () => {
  try {
    const sequelize_db = new Sequelize('mysql', process.env.DB_USER, process.env.DB_PASSWORD, {
      host: process.env.DB_HOST,
      dialect: 'mysql',
    });

    const [results] = await sequelize_db.query(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${process.env.DB_NAME}'`
    );

    if (results.length === 0) {
      await sequelize_db.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`Database ${process.env.DB_NAME} created successfully.`);
    }

    await sequelize_db.close();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

exports.createTables = async () => {
  try {
    await sequelize.sync();
    console.log('Models synchronized successfully.');
  } catch (error) {
    console.error('Error occured while creating tables', error);
  }
};
