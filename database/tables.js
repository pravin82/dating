
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

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});


const createAllTables = () => {
  createUserTable();
};

module.exports =  {
  createAllTables
};

require('make-runnable');