const express = require('express')
const app = express()
const { findProducts, findStyles,findFeatures,findRelated } = require('../db.js')
const url = require('url')
var cors = require('cors');
app.use(cors());
const config = require ('../.env');

app.get('/products', (req, res) => {
  const path = url.parse(req.url).path;
  let route = `https://localhost:3000${path}`;
  let urls = new URL(route);
  let params = new URLSearchParams(urls.search.slice(1));
  var count = params.get('count') || 5;
  var page = params.get('page') || 1;
  var start =( page-1) * count ;
  var end = page * count;
  // console.log('this is the start and end',start,end);

 findProducts(function (data) {
    res.status(200).send(data)
  },start,end)
})

app.get(`/${config.TOKEN}`, (req, res) => {

  res.send('loaderio-d559156522d93f2a293d0d9afcb8946e');
})


app.get('/products/:id/styles', (req, res) => {
  var id = req.params.id
  findStyles(function (data) {
    res.status(200).send(data)
  }, id)
})

app.get('/products/:id/related',(req,res)=>{
  var id = req.params.id;
  findRelated(function (data) {
    res.status(200).send(data)
  }, id)
})

app.get('/products/:id/',(req,res)=>{
  var id = req.params.id;
  findFeatures(function (data) {
    res.status(200).send(data)
  }, id)
})

module.exports = app;
