const excelJS = require('exceljs');
const PDFDocument = require('pdfkit');

exports.exportToPdf = (shifts, dataCallback, endCallback) => {
  const doc = new PDFDocument();
  doc.on('data', dataCallback);
  doc.on('end', endCallback);

  shifts.map((shift) => {
    doc.fontSize(18);
    doc.text(`${shift.shift_date}:  ${shift.start_time} - ${shift.end_time ? shift.end_time : 'Ongoing'}`, {
      align: 'justify',
    });
    if (shift.comment) {
      doc.fontSize(14);
      doc.text(`Comment: ${shift.comment}`);
    }
    if (shift.breaks && shift.breaks.length > 0) {
      doc.fontSize(14);
      doc.text('Breaks:', { indent: 30 });
      shift.breaks.map((breakItem) => {
        doc.text(`${breakItem.start_time} - ${breakItem.end_time ? breakItem.end_time : 'Ongoing'}`, {
          indent: 30,
        });
      });
    }
    doc.moveDown();
  });
  doc.end();
};

exports.exportToExcel = (format, shifts, res) => {
  try {
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

    res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment;filename=shifts.${format}`);
    switch (format) {
      case 'csv':
        workbook.csv.write(res);
        break;
      case 'xls':
      case 'xlsx':
        workbook.xlsx.write(res);
        break;
      default:
        return res.status(501).json({ error: 'Not supprted format.' });
    }
  } catch (error) {
    console.error('An error occured while creating a file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
