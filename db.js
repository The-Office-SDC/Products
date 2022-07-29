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
// select json_agg(row_to_json(tu))
//       from (
//           select id, name,(
//               select row_to_json(features) from features where features.product_id = id
//           ) team
//       from product
//   ) tu

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

var findStyles = function (callback) {
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query(
      `select json_build_object(
        'product_id',(select productid from "styles" where productid = '${id.toString()}' limit 1),
        'results', json_agg(json_build_object(
        'style_id', style_id,
        'name',name,
        'original_price',original_price,
        'sale_price',sale_price,
        'default?',default_style
        )) ) p
        from styles where productid = '${id.toString()}'
        left join (select styleid, json_agg(json_build_object(
          'size', size,
          'quantity', quantity
          )
          ) cars
         from skus c
        ) c on p.style_id = c.styleid;
      `,
      (err, res) => {
        done()
        if (err) {
          console.log(err.stack)
        } else {
          console.log('before callback', res.rows[0])
          callback(res.rows[0])
          pool.end()
        }
      }
    )
  })
}
// select row_to_json(t)
// from (
//   select text, pronunciation,
//     (
//       select array_to_json(array_agg(row_to_json(d)))
//       from (
//         select part_of_speech, body
//         from definitions
//         where word_id=words.id
//         order by position asc
//       ) d
//     ) as definitions
//   from words
//   where text = 'autumn'
// ) t

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
