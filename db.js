const { Pool, Client } = require('pg')

const fromDate = new Date()

const pool = new Pool({
  user: 'air',
  host: 'localhost',
  database: 'demo',
  password: '',
  port: 5432
})

var findProducts = function (callback, start, end) {
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query(
      `SELECT * from product where id > ${start - 1} and id < ${end + 1}`,
      (err, res) => {
        done()
        if (err) {
          console.log(err.stack)
        } else {
          // console.log('before callback', res.rows)
          callback(res.rows)
          pool.end()
        }
      }
    )
  })
}


var findFeatures = function (callback, id) {
  console.log('iiiidddd',id)
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query(
      `select json_agg(row_to_json(tu))
       from (
          select id,name,slogan,description,category,default_price,(
              select json_agg(row_to_json(features)) FROM (select feature,value,product_id from "features" ) as features  where features.product_id = ${id}
          ) as features
       from product where id = ${id}
      ) tu `,
      (err, res) => {
        done()
        if (err) {
          console.log(err.stack)
        } else {
          console.log('before callback', res.rows[0].json_agg)
          callback(res.rows[0].json_agg)
          pool.end()
        }
      }
    )
  })
}
//

      // ( select json_agg(row_to_json("styles")) from) from "styles"
      // )
var findStyles = function (callback,id) {
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query(
      `select json_agg(row_to_json(tu)) from (
          select productid,
          (
          select json_agg(row_to_json("styles")) from (select style_id,productid,name,original_price,sale_price,default_style as default,
             (
              select json_agg(row_to_json("photos")) from "photos" where styleid = styles.style_id
             )as photos
             from "styles") as styles where productid = '${id}'
          ) as results
       from styles where productid = '${id}'
      ) tu


      `,
      (err, res) => {
        done()
        if (err) {
          console.log(err.stack)
        } else {
          console.log('before callback', res.rows[0].json_agg)
          callback(res.rows[0].json_agg[0])
          pool.end()
        }
      }
    )
  })
}


// select json_agg(row_to_json(tu))
//       from (
//           select id, name,(
//               select row_to_json(features) from features where features.product_id = id
//           ) team
//       from product
//   ) tu



exports.findProducts = findProducts
exports.findStyles = findStyles
exports.findFeatures = findFeatures

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
