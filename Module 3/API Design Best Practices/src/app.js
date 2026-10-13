/*const express = require('express');
const postRoutes = require('./routes/postRoutes');
const { resetData } = require('./data/postStore');
const controller = require('./controllers/postController');

function createApp() {
  const app = express();
  app.use(express.json());

  app.use('/', postRoutes);
  app.get('/explode', controller.explode);

  // TODO:
  // - make public contract resource-oriented
  // - standardise success envelope
  // - standardise error envelope
  // - add pagination metadata on list route
  // - cap limit server-side (default limit = 2 for exercise)
  // - stop exposing old verb routes as public contract
  // - expose safe internal failure route for testing/demo

  return app;
}

if (require.main === module) {
  const app = createApp();
  const port = 3000;
  app.listen(port, () => {
    console.log(`Starter API listening on port ${port}`);
  });
}

module.exports = {
  createApp,
  resetData
};
*/

const express = require('express');
const postRoutes = require('./routes/postRoutes');
const { resetData } = require('./data/postStore');
const controller = require('./controllers/postController');

function createApp() {
  const app = express();

  app.use(express.json());

  app.use('/', postRoutes);

  // Safe internal-failure demonstration route
  app.get('/__test/internal-error', controller.explode);

  // Handle unknown routes consistently
  app.use((req, res) => {
    res.status(404).json({
      error: {
        code: 'ROUTE_NOT_FOUND',
        message: 'Route not found'
      }
    });
  });

  // Centralized error handler
  app.use((err, req, res, next) => {
    console.error('Internal server error:', err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  });

  return app;
}

if (require.main === module) {
  const app = createApp();
  const port = 3000;

  app.listen(port, () => {
    console.log(`API listening on port ${port}`);
  });
}

module.exports = {
  createApp,
  resetData
};
