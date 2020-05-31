
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

const insertSampleUsers = () => {
  const usersQuery = `INSERT into users(email, name, password, image) 
                      values
                      ('john@gmail.com', 'john', 'password1', 'https://picsum.photos/id/1/200/300'),
                      ('smith@gmail.com', 'smith', 'password2', 'https://picsum.photos/id/2/200/300'),
                      ('warner@gmail.com', 'warner', 'password3', 'https://picsum.photos/id/3/200/300'),
                      ('rohit@gmail.com', 'rohit', 'password4', 'https://picsum.photos/id/4/200/300'),
                      ('virat@gmail.com', 'virat', 'password5', 'https://picsum.photos/id/5/200/300'),
                      ('dhoni@gmail.com', 'dhoni', 'password6', 'https://picsum.photos/id/6/200/300'),
                      ('ponting@gmail.com', 'ponting', 'password7', 'https://picsum.photos/id/7/200/300'),
                      ('anderson@gmail.com', 'anderson', 'password8', 'https://picsum.photos/id/8/200/300'),
                      ('steyn@gmail.com', 'steyn', 'password9', 'https://picsum.photos/id/9/200/300'),
                      ('bravo@gmail.com', 'bravo', 'password10', 'https://picsum.photos/id/10/200/300')`;

  
  pool.query(usersQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
  });
                      
}







const createAllTables = () => {
  createUserTable();
  updateUserTable();
  createTypes();
  createInteractionTable();
  insertSampleUsers();
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports =  {
  createAllTables
};

require('make-runnable');