const { isLogedin } = require('../middleware/middleware');
const authRoutes = require('./auth');
const shiftRoutes = require('./shift');
const exportRoutes = require('./export');

exports.setupRoutes = (app) => {
  app.use('/auth', authRoutes);
  app.use('/shift', isLogedin, shiftRoutes);
  app.use('/export', isLogedin, exportRoutes);
};
