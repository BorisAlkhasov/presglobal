const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const Employee = require('./employees');
const Shift = require('./shifts');

const TimeEntry = sequelize.define(
  'TimeEntry',
  {
    entry_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // references: {
      //   model: Employee,
      //   key: 'employee_id',
      // },
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    entry_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shift_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // references: {
      //   model: Shift,
      //   key: 'shift_id',
      // },
    },
    comment: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
  },
  {
    tableName: 'time_entries',
    timestamps: true,
  }
);

// TimeEntry.belongsTo(Employee, {
//   foreignKey: 'employee_id',
//   as: 'employee',
// });

// TimeEntry.belongsTo(Shift, {
//   foreignKey: 'shift_id',
//   as: 'shift',
// });

// TimeEntry.associate = (models) => {
//   TimeEntry.belongsTo(models.Employee, {
//     foreignKey: 'employee_id',
//     as: 'employee',
//   });
//   TimeEntry.belongsTo(models.Shift, {
//     foreignKey: 'shift_id',
//     as: 'shift',
//   });
// };

module.exports = TimeEntry;
