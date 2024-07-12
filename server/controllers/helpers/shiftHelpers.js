const { Op } = require('sequelize');
const { Shifts, Breaks } = require('../../utils/database');

exports.getShifts = async (employee_id, period) => {
  const currentDate = new Date();
  let startDate;

  switch (period) {
    case 'month':
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      break;
    case 'day':
    default:
      startDate = new Date(currentDate.setHours(0, 0, 0, 0));
  }

  const shifts = await Shifts.findAll({
    where: {
      employee_id,
      shift_date: {
        [Op.gte]: startDate,
        [Op.lt]: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000),
      },
    },
    include: [
      {
        model: Breaks,
        attributes: ['break_id', 'start_time', 'end_time'],
      },
    ],
    order: [
      ['shift_date', 'DESC'],
      ['start_time', 'DESC'],
      [Breaks, 'start_time', 'DESC'],
    ],
  });

  const formattedShifts = shifts.map((shift) => ({
    shift_id: shift.shift_id,
    employee_id: shift.employee_id,
    shift_date: new Date(shift.shift_date).toLocaleDateString('en-GB'),
    start_time: new Date(shift.start_time).toLocaleTimeString('en-GB'),
    end_time: shift.end_time ? new Date(shift.end_time).toLocaleTimeString('en-GB') : null,
    comment: shift.comment,
    breaks: shift.Breaks.map((breakItem) => ({
      break_id: breakItem.break_id,
      start_time: new Date(breakItem.start_time).toLocaleTimeString('en-GB'),
      end_time: breakItem.end_time ? new Date(breakItem.end_time).toLocaleTimeString('en-GB') : null,
    })),
  }));

  return formattedShifts;
};
