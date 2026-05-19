import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '30s', target: 100 },
    { duration: '1m', target: 200 },
    { duration: '1m', target: 200 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  let res = http.get('http://localhost:9090/fhir/Patient?_count=100');
  check(res, { 'status is 200': (r) => r.status === 200 });

  let patient = JSON.stringify({
    resourceType: 'Patient',
    name: [{ family: 'Load', given: ['Test' + Math.random()] }],
    birthDate: '1990-01-01',
    gender: 'male',
  });

  let res2 = http.post('http://localhost:9090/fhir/Patient', patient, {
    headers: { 'Content-Type': 'application/fhir+json' },
  });
  check(res2, { 'patient created': (r) => r.status === 201 });
}