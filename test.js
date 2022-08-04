const request = require('supertest')
const assert = require('assert')
const app = require('./server/app.js')
const expect = require('chai').expect

request(app)
  .get('/products')
  .expect('Content-Type', 'application/json; charset=utf-8')
  .expect(200)
  .end(function (err, res) {
    if (err) throw err
    // console.log(res)
  })

describe('GET /products/5/related', function () {
  it('returns all related items in an array', async function () {
    const response = await request(app)
      .get('/products/5/related')
      .set('Accept', 'application/json')
      .catch(err => done(err))

    expect(response.text).equal('[6,6,8,9,1,3]')
    expect(response.status).equal(200)

  })
})

describe('GET /products/?count=2&page=2', function () {
  it('returns products in an array', async function () {
    const response = await request(app)
      .get('/products/?count=2&page=2')
      .set('Accept', 'application/json')
      .catch(err => done(err))
    const result = JSON.parse(response.text)
    expect(result[0].name).equal('Bright Future Sunglasses')
    expect(response.status).equal(200)
  })
})

describe('GET /products/5/styles', function () {
  it('returns all styles in an object', async function () {
    this.timeout(8000)
    const response = await request(app)
      .get('/products/5/styles')
      .set('Accept', 'application/json')
      .catch(err => done(err))
    const result = JSON.parse(response.text)
    expect(result.results[0].style_id).equal(26)
    expect(response.status).equal(200);

  })
})

describe('GET /products/5', function () {
  it('returns all styles in an object', async function () {
    this.timeout(10000)
    const response = await request(app)
      .get('/products/5')
      .set('Accept', 'application/json')
      .catch(err => done(err))
    const result = JSON.parse(response.text)
    expect(result.id).equal(5)
    expect(response.status).equal(200);

  })
})
