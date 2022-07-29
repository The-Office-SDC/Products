const express = require('express')
const app = express()
const { findProducts, findStyles,findFeatures } = require('./db.js')
const url = require('url')

app.get('/products/', (req, res) => {
  const path = url.parse(req.url).path;
  let route = `https://localhost:3000${path}`;
  let urls = new URL(route);
  let params = new URLSearchParams(urls.search.slice(1));
  var count = params.get('count');
  var page = params.get('page');
  var start =( page-1) * count;
  var end = page * count;
   console.log(start,end)
  findProducts(function (data) {
    res.status(200).send(data)
  },start,end)
})

app.get('/products/:id/',(req,res)=>{
  var id = req.params.id;
  findFeatures(function (data) {
    res.status(200).send(data)
  }, id)
})




app.get('/products/:id/styles', (req, res) => {
  var id = req.params.id
  findStyles(function (data) {
    res.status(200).send(data)
  }, id)
})
let urls = new URL('https://example.com?foo=1&bar=2') // or construct from window.location


app.listen(3000, () => {
  console.log(` listening on port 3000`)
})
