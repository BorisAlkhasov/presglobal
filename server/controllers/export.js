const shiftHelpers = require('./helpers/shiftHelpers');
const { exportToExcel, exportToPdf } = require('../services/exportService');

exports.exportFile = async (req, res) => {
  const { format, employee_id } = req.params;

  if (!format) {
    return res.status(400).json({ error: 'File format is required' });
  }

  const shifts = await shiftHelpers.getShifts(employee_id, 'month');

  switch (format) {
    case 'pdf':
      {
        const stream = res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment;filename=shifts.pdf',
        });
        exportToPdf(
          shifts,
          (chunk) => stream.write(chunk),
          () => stream.end()
        );
      }
      break;
    case 'csv':
    case 'xls':
    case 'xlsx':
      exportToExcel(format, shifts, res);
      break;
    default:
      res.status(501).json({ error: 'Unsupported format.' });
  }
};
