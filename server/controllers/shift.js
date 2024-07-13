const { Op } = require('sequelize');
const shiftHelpers = require('./helpers/shiftHelpers');
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

    const formattedShifts = await shiftHelpers.getShifts(employee_id, period);

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
