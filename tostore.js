var findStyles = function (callback, id) {
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query(
     ` SELECT json_build_object(
        'style_id',(select style_id from "styles"  where productid = '${id.toString()}' limit 1),
        'name',(select name from "styles"  where productid = '${id.toString()}' limit 1),
        'sale_price',(select sale_price from "styles"  where productid = '${id.toString()}'limit 1),
        'original_price', (select original_price from "styles" limit 1),
        'default_style',(select default_style from "styles" limit 1),
        'skus',(SELECT json_agg(row_to_json("skus")) from "skus" where styleid =1 )
      ) `,
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

var findStyles = function (callback, id) {
  pool.connect((err, client, done) => {
    if (err) throw err
    client.query(
      `SELECT json_build_object(
        'product_id', (select productid from "styles" where productid = '${id.toString()}' limit 1),
        'results', (SELECT json_agg(row_to_json("styles")) from "styles" where productid ='${id.toString()}')
      ) `,
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

select json_build_object(
        'persons', json_aggc(json_build_object(
        'person_name', p.name,
        'cars', cars))
         ) persons
from person p
left join (select personid, json_agg(json_build_object(
          'carid', c.id,
          'type', c.type,
          )
          ) cars
         from car c
        ) c on p.id = c.personid;

        select json_build_object(
          'persons', json_aggc(json_build_object(
          'person_name', p.name,
          'cars', cars))
           ) persons
  from person p
  left join (select personid, json_agg(json_build_object(
                             'carid', c.id,
                             'type', c.type,
                             'wheels', wheels)
                              ) cars
           from car c
           left join (select carid, json_agg(json_build_object(
                          'which', w.whichone,
                          'serial number', w.serialnumber)) wheels
              from wheel w
              group by 1
          ) w on c.id = w.carid
           group by personid
          ) c on p.id = c.personid;


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
