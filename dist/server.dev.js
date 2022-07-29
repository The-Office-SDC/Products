"use strict";

var express = require('express');

var app = express();

var _require = require('./db.js'),
    findProducts = _require.findProducts,
    findStyles = _require.findStyles;

var url = require('url');

app.get('/products/', function (req, res) {
  console.log('request', req.params);
  findProducts(function (data) {
    res.status(200).send(data);
  });
});
app.get('/:id/styles', function (req, res) {
  var id = req.params.id;
  findStyles(function (data) {
    res.status(200).send(data);
  }, id);
});
app.listen(3000, function () {
  console.log(" listening on port 3000");
});