require('dotenv').config();

// Check for required env variables
const requiredEnv = ['DATABASE_URL', 'JWT_SECRET', 'PUSHER_APP_ID', 'PUSHER_KEY', 'PUSHER_SECRET', 'PUSHER_CLUSTER'];
requiredEnv.forEach(env => {
  if (!process.env[env]) {
    console.warn(`Warning: ${env} is not defined in environment variables`);
  }
});

const app = require('./src/app');
const db = require('./src/config/database');

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  db.query('SELECT NOW()')
    .then(() => {
      console.log('Database connected successfully');
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    })
    .catch((err) => {
      console.error('Database connection failed:', err);
      process.exit(1);
    });
}

module.exports = app;