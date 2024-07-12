require('dotenv').config();
const express = require('express');
const { setupMiddleware } = require('./middleware/middleware');
const { setupRoutes } = require('./routes/routes');
const { createDatabase, createTables } = require('./utils/database');

const app = express();

async function startServer() {
  try {
    await createDatabase();
    await createTables();

    setupMiddleware(app, express);
    setupRoutes(app);

    app.listen(3030, () => {
      console.log('Listening on port 3030');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
