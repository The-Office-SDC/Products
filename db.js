const { Pool, Client } = require('pg')
var cache = require('js-cache')

const fromDate = new Date()

const pool = new Pool({
  user: 'ubuntu',
  database: 'demo',
  host:'ec2-52-53-181-229.us-west-1.compute.amazonaws.com',
  password: 'password',
  port: 5432
})

var findProducts = function (callback, start, end) {
  // if (cache.get(`${(start, end)}`)) {
  //   console.log('found cache');
  //   callback(cache.get(`${(start, end)}`));
  // } else {
    pool.connect((err, client, done) => {
      if (err) throw err;
      client.query(
        ` SELECT * from product where id > ${start - 1} and id < ${end + 1}`,
        (err, res) => {
          done()
          if (err) {
            console.log(err.stack)
          } else {
            // console.log('before callback', res.rows)
            cache.set(`${(start, end)}`, res.rows)
            callback(res.rows)
          }
        }
      )
    })
  // }
}
// cache.set('lorem', 'ipsum', 60000);
// console.log(cache.get('lorem'));

var findStyles = function (callback, id) {
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query(
      ` SELECT productid, (select json_agg(obj) results FROM

        (SELECT  style_id,name,sale_price,original_price,default_style as "default?",
        json_agg(distinct jsonb_build_object('url',rp.url,'thumbnail_url',rp.thumbnail_url)) AS photos,
        json_object_agg(k.id,json_build_object('quantity',quantity,'size',size)) AS skus
        FROM styles r
        LEFT JOIN photos rp
        ON rp.styleid = r.style_id

        LEFT JOIN skus k
        ON r.style_id = k.styleid

        WHERE r.productid = '${id}'
        GROUP BY style_id
        )AS obj)

        from styles where productid = '${id}'
`,
      (err, res) => {
        done()
        if (err) {
          console.log(err.stack)
        } else {
          // console.log('before callback', res.rows)
          if (res.rows[0]) {
            callback(res.rows[0])
          } else {
            console.log('failed')
            callback('null')
          }
        }
      }
    )
  })
}

var findFeatures = function (callback, id) {
 // console.log('find the product features id', id)
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query(
      `SELECT json_agg(row_to_json(tu))
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
          // console.log('before callback', res.rows[0].json_agg[0])
          callback(res.rows[0].json_agg[0])
        }
      }
    )
  })
}

var findRelated = function (callback, id) {
 //console.log(id)

  pool.connect((err, client, done) => {
    if (err) throw err
    client.query(
      `SELECT array_agg(related_product_id) AS tag_arr
       FROM related where current_product_id = ${id}`,
      (err, res) => {
        done()
        if (err) {
          console.log(err.stack)
        } else {
          // console.log('before callback', res.rows)
          callback(res.rows[0].tag_arr)
        }
      }
    )
  })
}

exports.findProducts = findProducts
exports.findStyles = findStyles
exports.findFeatures = findFeatures
exports.findRelated = findRelated
