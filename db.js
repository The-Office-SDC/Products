const { Pool, Client } = require('pg')

const fromDate = new Date()

const pool = new Pool({
  user: 'air',
  host: 'localhost',
  database: 'demo',
  password: '',
  port: 5432
})

// var findCart = function (callback) {
//   pool.connect((err, client, done) => {
//     if (err) throw err
//     client.query(
//       `SELECT '{"a": {"key":"value"}, "b": 2, "c": true}'::jsonb - 'a' `,
//       (err, res) => {
//         done()
//         if (err) {
//           console.log(err.stack)
//         } else {
//           // const toDate = new Date();
//           // const elapsed = toDate.getTime() - fromDate.getTime();
//           console.log('before callback', res.rows)
//           callback(res.rows)
//           pool.end()
//         }
//       }
//     )
//   })
// }

var findCart = (function (callback) {
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query(
      `SELECT json_build_object('cart',(SELECT json_agg(row_to_json(cart))
    FROM cart))`,
      (err, res) => {
        done()
        if (err) {
          console.log(err.stack)
        } else {
          // const toDate = new Date();
          // const elapsed = toDate.getTime() - fromDate.getTime();
          console.log('before callback', res.rows)
          callback(res.rows)
          pool.end()
        }
      }
    )
  })
})

// `select json_build_object(
//         'persons', json_agg(json_build_object(
//         'person_name', p.name,
//         'cars', cars))
//          ) persons
// from person p
// left join (select personid, json_agg(json_build_object(
//                 'carid', c.id,
//                 'type', c.type,
//                 'wheels', wheels)
//           ) cars
//      from
//         car c
//         left join (
//             select
//                 carid,
//                 json_agg(
//                     json_build_object(
//                         'which', w.whichone,
//                         'serial number', w.serialnumber
//                     )
//                 ) wheels
//             from wheel w
//             group by 1
//         ) w on c.id = w.carid
//     group by personid
// ) c on p.id = c.personid;
// `

var findStyles = function (callback, id) {
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query(
      // `SELECT row_to_json("cart")
      // FROM "cart"
      // WHERE id = 1;`,
      `SELECT json_build_object(
        'product_id', (select productid from "styles" where productid = ${id} limit 1),
        'results', (SELECT json_agg(row_to_json("styles")) from "styles" where productid = ${id})
      )`,
      // `SELECT json_build_object(
      //   'cartid', (SELECT json_agg(row_to_json("ci")) from (SELECT id FROM "cart" where id =1) as ci),
      //   'cart', (SELECT json_agg(row_to_json("cart")) from "cart")
      // )`,
      (err, res) => {
        done()
        if (err) {
          console.log(err.stack)
        } else {
          console.log('before callback', res.rows[0].json_build_object)
          callback(res.rows[0].json_build_object)
          // pool.end()
        }
      }
    )
  })
}

exports.findCart = findCart
exports.findStyles = findStyles

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
