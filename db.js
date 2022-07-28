const { Pool, Client } = require('pg')

const fromDate = new Date();


const pool = new Pool({
  user: 'air',
  host: 'localhost',
  database: 'demo',
  password: '',
  port: 5432
})

pool.connect((err, client, done) => {
  if (err) throw err
  client.query('SELECT * FROM photos', (err, res) => {
    done()
    if (err) {
      console.log(err.stack)
    } else {
      const toDate = new Date();
      const elapsed = toDate.getTime() - fromDate.getTime();
      console.log(elapsed)
      pool.end()
    }
  })
})




// const client = new Client({
//   user: 'air',
//   host: 'localhost',
//   database: 'demo',
//   password: '',
//   port: 5432
// })

// client.connect()
// client.query('SELECT * FROM photos', (err, res) => {
//   console.log(err, 1)
//   const toDate = new Date();
//   const elapsed = toDate.getTime() - fromDate.getTime();
//   console.log(elapsed)
//   client.end()
// })

