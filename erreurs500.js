import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 10,
  duration: '2m',
};

export default function () {
  let invalidPayloads = [
    '{"name": "invalid"}',
    '{"resourceType": "FakeResource", "name": "test"}',
    '{resourceType: Patient, broken json!!!}',
  ];

  let payload = invalidPayloads[Math.floor(Math.random() * 3)];

  let res = http.post('http://localhost:9090/fhir/Patient', payload, {
    headers: { 'Content-Type': 'application/fhir+json' },
  });

  check(res, {
    'is error (4xx or 5xx)': (r) => r.status >= 400,
  });

  sleep(0.1);
}