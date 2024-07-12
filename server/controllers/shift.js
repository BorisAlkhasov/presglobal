const { Op } = require('sequelize');
const { Employees, Shifts, Breaks } = require('../utils/database');

exports.startShift = async (req, res) => {
  try {
    const { employee_id } = req.body;

    if (!employee_id) {
      return res.status(400).json({ error: 'Employee ID is required' });
    }

    const employee = await Employees.findByPk(employee_id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const ongoingShift = await Shifts.findOne({
      where: {
        employee_id,
        end_time: null,
      },
    });

    if (ongoingShift) {
      return res.status(400).json({ error: 'Employee already has an ongoing shift' });
    }

    const newShift = await Shifts.create({
      employee_id,
      shift_date: new Date(),
      start_time: new Date(),
    });

    const { shift_id, shift_date, start_time } = newShift;

    res.status(201).json({
      message: 'Shift started successfully',
      shift: {
        shift_id,
        shift_date: new Date(shift_date).toLocaleDateString('en-GB'),
        start_time: new Date(start_time).toLocaleTimeString('en-GB'),
        end_time: null,
      },
    });
  } catch (error) {
    console.error('Error starting shift:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.endShift = async (req, res) => {
  try {
    const { employee_id } = req.body;

    if (!employee_id) {
      return res.status(400).json({ error: 'Employee ID is required' });
    }

    const ongoingShift = await Shifts.findOne({
      where: {
        employee_id,
        end_time: null,
      },
    });

    if (!ongoingShift) {
      return res.status(404).json({ error: 'No ongoing shift found' });
    }

    const ongoingBreak = await Breaks.findOne({
      where: {
        shift_id: ongoingShift.shift_id,
        end_time: null,
      },
    });

    if (ongoingBreak) {
      return res.status(400).json({ error: 'Cannot end shift while on break. Please end the break first.' });
    }

    ongoingShift.end_time = new Date();
    await ongoingShift.save();

    res.status(200).json({ message: 'Shift ended successfully' });
  } catch (error) {
    console.error('Error ending shift:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.startBreak = async (req, res) => {
  try {
    const { employee_id } = req.body;

    if (!employee_id) {
      return res.status(400).json({ error: 'Employee ID is required' });
    }

    const ongoingShift = await Shifts.findOne({
      where: {
        employee_id,
        end_time: null,
      },
    });

    if (!ongoingShift) {
      return res.status(404).json({ error: 'Shift not found' });
    }

    if (!ongoingShift.start_time || ongoingShift.end_time) {
      return res.status(400).json({ error: 'Cannot start break. Shift has not started or has already ended.' });
    }

    const ongoingBreak = await Breaks.findOne({
      where: {
        shift_id: ongoingShift.shift_id,
        end_time: null,
      },
    });

    if (ongoingBreak) {
      return res.status(400).json({ error: 'Cannot start break. There is already an ongoing break.' });
    }

    const newBreak = await Breaks.create({
      shift_id: ongoingShift.shift_id,
      start_time: new Date(),
    });

    const { break_id, start_time } = newBreak;

    res.status(201).json({
      message: 'Break started successfully',
      break: {
        break_id,
        start_time: new Date(start_time).toLocaleTimeString('en-GB'),
      },
    });
  } catch (error) {
    console.error('Error starting break:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.endBreak = async (req, res) => {
  try {
    const { employee_id } = req.body;

    if (!employee_id) {
      return res.status(400).json({ error: 'Employee ID is required' });
    }

    const ongoingShift = await Shifts.findOne({
      where: {
        employee_id,
        end_time: null,
      },
    });

    if (!ongoingShift) {
      return res.status(404).json({ error: 'Shift not found' });
    }

    const ongoingBreak = await Breaks.findOne({
      where: {
        shift_id: ongoingShift.shift_id,
        end_time: null,
      },
      include: [
        {
          model: Shifts,
          where: {
            end_time: null,
            shift_date: { [Op.lte]: new Date() },
          },
          required: true,
        },
      ],
    });

    if (!ongoingBreak) {
      return res.status(404).json({ error: 'No ongoing break found' });
    }

    ongoingBreak.end_time = new Date();
    await ongoingBreak.save();

    res.status(200).json({ message: 'Break ended successfully' });
  } catch (error) {
    console.error('Error ending break:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { shift_id, comment } = req.body;

    if (!shift_id) {
      return res.status(400).json({ error: 'Shift ID is required' });
    }

    const shift = await Shifts.findByPk(shift_id);
    if (!shift) {
      return res.status(404).json({ error: 'Shift not found' });
    }

    shift.comment = comment;
    await shift.save();

    res.status(200).json({
      message: 'Comment added to shift successfully',
      shift: { shift_id },
    });
  } catch (error) {
    console.error('Error adding comment to shift:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getShifts = async (req, res) => {
  try {
    const { employee_id, period } = req.query;

    if (!employee_id) {
      return res.status(400).json({ error: 'Employee ID is required' });
    }

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

    const ongoingShift = await Shifts.findOne({
      where: {
        employee_id,
        shift_date: { [Op.lte]: currentDate },
        end_time: null,
      },
      include: [
        {
          model: Breaks,
          where: { end_time: null },
          required: false,
        },
      ],
    });

    let ongoingBreak = null;
    if (ongoingShift && ongoingShift.Breaks.length > 0) {
      ongoingBreak = ongoingShift.Breaks[0];
    }

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

    res.status(200).json({
      message: `Shifts retrieved successfully for current ${period}`,
      is_on_shift: !!ongoingShift,
      is_on_break: !!ongoingBreak,
      shifts: formattedShifts,
    });
  } catch (error) {
    console.error('Error retrieving shifts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
