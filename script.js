import http from 'k6/http';
import { sleep, check } from 'k6'
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";


export const options = {
  duration :'1m',
  vus : 500,
}
export default function () {
  const url = 'http://localhost:3000/products/?count=10000&page=100';
  const res = http.get(url)
  check(res, {
    'is success': (r) => r.status === 200
})
  sleep(1)
}

// export function handleSummary(data) {
//   return {
//     "summary.html": htmlReport(data),
//   };
// }