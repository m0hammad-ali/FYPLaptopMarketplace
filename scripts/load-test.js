import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '15s', target: 20 },
    { duration: '30s', target: 50 },
    { duration: '15s', target: 100 },
    { duration: '15s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const payload = JSON.stringify({
    budget: 400000,
    usage: 'gaming',
    top_k: 5,
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post('http://host.docker.internal:5004/recommend', payload, params);

  check(res, {
    'status 200': (r) => r.status === 200,
    'has recommendations': (r) => r.body.includes('recommendations'),
  });

  sleep(1);
}
