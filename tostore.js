

// select json_build_object(
//         'persons', json_aggc(json_build_object(
//         'person_name', p.name,
//         'cars', cars))
//          ) persons
// from person p
// left join (select personid, json_agg(json_build_object(
//           'carid', c.id,
//           'type', c.type,
//           )
//           ) cars
//          from car c
//         ) c on p.id = c.personid;

//         select json_build_object(
//           'persons', json_aggc(json_build_object(
//           'person_name', p.name,
//           'cars', cars))
//            ) persons
//   from person p
//   left join (select personid, json_agg(json_build_object(
//                              'carid', c.id,
//                              'type', c.type,
//                              'wheels', wheels)
//                               ) cars
//            from car c
//            left join (select carid, json_agg(json_build_object(
//                           'which', w.whichone,
//                           'serial number', w.serialnumber)) wheels
//               from wheel w
//               group by 1
//           ) w on c.id = w.carid
//            group by personid
//           ) c on p.id = c.personid;


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
          `


// var findStyles = function (callback, id) {
//   pool.connect((err, client, done) => {
//     if (err) throw err
//     client.query(
//       `select json_build_object(
//         'product_id', productid,
//         'results', json_agg(json_build_object(
//         'style_id', style_id,
//         'name',name,
//         'original_price',original_price,
//         'sale_price',sale_price,
//         'default?',default_style
//         )) )
//         from styles p
//         left join skus c
//         on p.style_id = c.styleid
//         where productid = '${id.toString()}';
//       `,
//       (err, res) => {
//         done()
//         if (err) {
//           console.log(err.stack)
//         } else {
//           console.log('before callback', res.rows[0].json_build_object)
//           callback(res.rows[0].p)
//         }
//       }
//     )
//   })
// }


From teammate:
// `SELECT r.id review_id, r.rating, r.summary, r.recommend, r.response, r.body, r.date, r.reviewer_name, r.helpfulness,
//   json_agg(rp) photos
//   FROM reviews r
//   LEFT OUTER JOIN reviews_photos rp
//   ON rp.review_id = r.id
//   WHERE r.product_id = $2 AND r.reported = FALSE
//   GROUP BY r.id, rp.* ORDER BY ${sorter(sort)} DESC LIMIT $1 OFFSET $3`


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



HIGHTLIGHT

// var findStyles = function (callback,id) {
//   pool.connect((err, client, done) => {
//     if (err) throw err
//     client.query(
//       `select json_agg(row_to_json(tu)) from (
//           select productid,
//           (
//           select json_agg(row_to_json("styles")) from (select style_id,productid,name,original_price,sale_price,default_style as default,
//              (
//               select json_agg(row_to_json("photos")) from "photos" where styleid = styles.style_id
//              )as photos,
//                (
//                 select json_agg(row_to_json("skus")) from "skus" where styleid = styles.style_id

//                ) as  skus
//              from "styles") as styles where productid = '${id}'
//           ) as results
//        from styles where productid = '${id}'
//       ) tu
//       `,
//       (err, res) => {
//         done()
//         if (err) {
//           console.log(err.stack)
//         } else {
//           console.log('before callback', res.rows)
//           if(res.rows[0].json_agg){
//             callback(res.rows[0].json_agg[0])
//           }else{
//             console.log('failed')
//             callback('null')
//           }
//         }
//       }
//     )
//   })
// }


partial works:
`SELECT productid, (select json_agg(objone) results FROM

(SELECT  r.style_id,name,sale_price,original_price,default_style as "default?",
json_agg(rp) photos,
json_build_object(k.id,json_build_object('quantity',k.quantity,'size',k.size)) skus
FROM styles r
INNER JOIN photos rp
ON rp.styleid = r.style_id

INNER JOIN skus k
ON r.style_id = k.styleid

WHERE r.productid = '${id}'
GROUP BY style_id,k.id
)AS objone)

from styles where productid = '${id}'
GROUP BY style_id
`

Not work
 `
SELECT productid,
(
SELECT json_agg(row_to_json("styles")) from (select style_id,productid,name,original_price,sale_price,default_style as "default?",
    (
    SELECT json_agg(row_to_json("photos")) from "photos" where styleid = styles.style_id
    )as photos,
        (select json_object_agg() from "skus" where skus.styleid = style_id)AS skus

    from "styles") as styles where productid = '${id}'
) as results

from styles

where productid = '${id}'`



issues with GROUP BY :
`SELECT productid, (select json_agg(objone) results FROM

        (SELECT  r.style_id,name,sale_price,original_price,default_style as "default?",
        json_agg(rp) photos,
         (select json_build_object(k.id,json_build_object('quantity',k.quantity,'size',k.size) )AS skus  GROUP BY k.id)
        FROM styles r
        LEFT OUTER JOIN photos rp
        ON rp.styleid = r.style_id

        LEFT JOIN skus k
        ON r.style_id = k.styleid

        WHERE r.productid = '${id}'
        GROUP BY style_id,k.id
        ) AS objone)

        from styles where productid = '${id}'`

FROM Jennifer

SELECT id AS product_id,
       (SELECT json_agg(json_build_object('style_id', styles.style_id,'name', styles.name,'original_price', styles.original_price,'sale_price', styles.default_style,'default?', styles.default_style,
         'photos', (SELECT json_agg(json_build_object('thumbnail_url', photos.thumbnail_url,'url', photos.url))
           FROM photos
           WHERE photos.styleid = styles.style_id),
         'skus', (SELECT json_object_agg(skus.id,json_build_object('quantity', skus.quantity,'size', skus.size))
           FROM skus
           WHERE skus.styleid = styles.style_id)))
       FROM styles
       WHERE styles.productid = '${id}')
AS results
FROM product
WHERE id = '${id}'