
'use strict'

const Pool = require('pg').Pool


const pool = new Pool({
  user: 'root',
  host: 'localhost',
  database: 'dating_local',
  password: 'Pravin@1996'
})

function sqlExecutor(req, res, statement, values, cb) {
  pool.query( statement, values , 
      function (err, results, field) {
        if (err) {
          cb(null, err)
        } else {
          cb(results, null)
        }
      });
}

function sqlExecutorAsync(req, res, statement, values) {
  return new Promise((resolve, reject) => {
    sqlExecutor(req, res, statement, values, (result, error) => {
      if (error) {
        console.log('====ERROR:===')
        console.log(error)
        return resolve({ status: 'error', msg: 'Unexpected error occurred', error })
      }
      return resolve({ status: 'success', data: result })
    })
  })
}

module.exports = {
  sqlExecutorAsync,
  sqlExecutor,
  pool
}


