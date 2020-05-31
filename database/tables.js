
const dbUtils = require("./sql.js");
const pool = dbUtils.pool;

pool.on('connect', () => {
  console.log('connected to the db');
});


const createUserTable = () => {
  const userCreateQuery = `CREATE TABLE IF NOT EXISTS users
  (id SERIAL PRIMARY KEY, 
  email VARCHAR(100) UNIQUE NOT NULL, 
  name VARCHAR(100), 
  password VARCHAR(100) NOT NULL,
  created_on DATE DEFAULT CURRENT_TIMESTAMP NOT NULL)`;

  pool.query(userCreateQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const updateUserTable = () => {
  const updateUserQuery = `
              ALTER TABLE users ADD COLUMN image VARCHAR(255)`;
  
  pool.query(updateUserQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}



const createTypes = () => {
  const typeQuery = `CREATE TYPE operation AS ENUM ('LIKE', 'SUPERLIKE', 'BLOCK')`;
  pool.query(typeQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}


const createInteractionTable = () => {
  const interactionQuery = `CREATE TABLE IF NOT EXISTS interactions
  (id SERIAL PRIMARY KEY, 
  base_user INTEGER NOT NULL, 
  target_user INTEGER NOT NULL, 
  user_activity operation,
  created_on DATE DEFAULT CURRENT_TIMESTAMP NOT NULL)`;

  pool.query(interactionQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};







const createAllTables = () => {
  createUserTable();
  updateUserTable();
  createTypes();
  createInteractionTable();
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports =  {
  createAllTables
};

require('make-runnable');