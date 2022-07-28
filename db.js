const { Pool, Client } = require('pg')
const pool = new Pool({
  user: 'root',
  // host: 'database.server.com',
  database: 'demo',
  password: '',
  port: 4000,
})

pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  pool.end()
})

const client = new Client({
  user: 'dbuser',
  host: 'database.server.com',
  database: 'mydb',
  password: 'secretpassword',
  port: 4000,
})

client.connect()

client.query('SELECT * FROM cart', (err, res) => {
  console.log(err, res)
  client.end()
})