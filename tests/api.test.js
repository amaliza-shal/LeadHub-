const BASE = 'http://localhost:3000';

async function run() {
  console.log('Running API smoke tests...');

  const status = await (await fetch(BASE + '/api/status')).json();
  console.log('status:', status);

  const signupResp = await fetch(BASE + '/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Auto Test', email: 'autotest@example.com', password: 'test1234' })
  });
  const signupBody = await signupResp.json();
  console.log('signup:', signupBody.success ? 'OK' : signupBody);

  const loginResp = await fetch(BASE + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'autotest@example.com', password: 'test1234' })
  });
  const loginBody = await loginResp.json();
  console.log('login token present:', !!loginBody.token);

  if (loginBody.token) {
    const progress = await (await fetch(BASE + '/api/progress', { headers: { Authorization: 'Bearer ' + loginBody.token } })).json();
    console.log('progress keys:', Object.keys(progress || {}));
  }

  console.log('API smoke tests completed');
}

run().catch(err => { console.error(err); process.exit(2); });
