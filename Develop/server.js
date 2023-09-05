const express = require('express');
const routes = require('./routes');
const sequelize = require('./sequelize'); // Import your Sequelize configuration
// import sequelize connection

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// Sync Sequelize models to the database
sequelize.sync()
  .then(() => {
    console.log('Sequelize models synced to the database');

    // sync sequelize models to the database, then turn on the server
    // Start the Express.js server
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}!`);
    });
  })
  .catch((error) => {
    console.error('Error syncing Sequelize models:', error);
  });
    
    
    
