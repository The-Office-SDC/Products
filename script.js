import http from 'k6/http';

export default function () {
  const url = 'http://localhost:3000/products';
  // const payload = JSON.stringify({
  //   email: 'johndoe@example.com',
  //   password: 'PASSWORD',
  // });

  // const params = {
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // };

  // http.post(url, payload, params);

  const res = http.get(url)
  console.log('response body', res.body)
}