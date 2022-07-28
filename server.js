const express = require('express')
const app = express()
const {findCart,findStyles} = require('./db.js')



app.get('/cart', (req, res) => {
  findCart(function(data){
    res.status(200).send(data)
  })
})

app.get('/:id/styles', (req, res) => {
  var id = req.params.id;
  findStyles(function(data){
    res.status(200).send(data)
  },id)
})

app.listen(3000, () => {
  console.log(` listening on port 3000`)
})
