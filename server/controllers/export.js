const excelJS = require('exceljs');
const shiftHelpers = require('./helpers/shiftHelpers');

exports.exportFile = async (req, res) => {
  const { format, employee_id } = req.params;

  if (!format) {
    return res.status(400).json({ error: 'File format is required' });
  }

  try {
    const shifts = await shiftHelpers.getShifts(employee_id, 'month');

    const workbook = new excelJS.Workbook();
    const sheet = workbook.addWorksheet('Shifts');

    sheet.columns = [
      { header: 'Date', key: 'shift_date', width: 20 },
      { header: 'Start', key: 'shift_start', width: 20 },
      { header: 'End', key: 'shift_end', width: 20 },
      { header: 'Comment', key: 'shift_comment', width: 40 },
      { header: 'Break Start', key: 'break_start', width: 20 },
      { header: 'Break End', key: 'break_end', width: 20 },
    ];

    shifts.map((shift) => {
      let row = {
        shift_date: shift.shift_date,
        shift_start: shift.start_time,
        shift_end: shift.end_time,
        shift_comment: shift.comment,
      };

      if (shift.breaks && shift.breaks.length > 0) {
        shift.breaks.map((breakItem) => {
          row['break_start'] = breakItem.start_time;
          row['break_end'] = breakItem.end_time;

          sheet.addRow(row);
        });
      } else {
        sheet.addRow(row);
      }
    });

    let buf = null;

    switch (format) {
      case 'csv':
        buf = await workbook.csv.writeBuffer();
        break;
      case 'xls':
      case 'xlsx':
        buf = await workbook.xlsx.writeBuffer();
        break;
      default:
        return res.status(501).json({ error: 'Not supprted format.' });
    }

    res.status(200).send(buf);
  } catch (error) {
    console.error('An error occured while creating a file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
