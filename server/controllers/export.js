exports.exportFile = (req, res) => {
  const { format } = req.params;

  if (!format) {
    return res.status(400).json({ error: 'File format is required' });
  }
};
