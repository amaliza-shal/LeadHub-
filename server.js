const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(express.json());

function loadDB() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { users: {}, progress: {}, courses: [] };
  }
}

function saveDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
}

// Serve static frontend from the project folder
app.use(express.static(path.join(__dirname)));

// Status
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// AUTH: Signup
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing name, email or password' });

  const db = loadDB();
  if (db.users[email]) return res.status(400).json({ error: 'User already exists' });

  // Demo: store password in plain text (NOT for production)
  db.users[email] = { name, email, password, createdAt: new Date().toISOString() };
  saveDB(db);

  return res.json({ success: true, user: { name, email }, token: email });
});

// AUTH: Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

  const db = loadDB();
  const user = db.users[email];
  if (!user) return res.status(400).json({ error: 'User not found' });
  // Demo check
  if (user.password && user.password !== password) return res.status(401).json({ error: 'Invalid credentials' });

  return res.json({ success: true, user: { name: user.name, email: user.email }, token: email });
});

// Courses list
app.get('/api/courses', (req, res) => {
  const db = loadDB();
  res.json(db.courses || []);
});

app.get('/api/courses/:id', (req, res) => {
  const db = loadDB();
  const course = (db.courses || []).find(c => c.id === req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(course);
});

// Progress endpoints (identify user by token sent in Authorization header or ?email=)
function getUserFromReq(req) {
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  if (req.query && req.query.email) return req.query.email;
  return null;
}

app.get('/api/progress', (req, res) => {
  const userEmail = getUserFromReq(req);
  if (!userEmail) return res.status(401).json({ error: 'Missing auth token' });

  const db = loadDB();
  const progress = db.progress[userEmail] || { xp: 0, level: 1, courses: {}, challenges: {}, assessments: {} };
  res.json(progress);
});

app.post('/api/progress', (req, res) => {
  const userEmail = getUserFromReq(req);
  if (!userEmail) return res.status(401).json({ error: 'Missing auth token' });

  const payload = req.body || {};
  const db = loadDB();
  if (!db.progress[userEmail]) db.progress[userEmail] = { xp: 0, level: 1, courses: {}, challenges: {}, assessments: {} };

  // Merge incoming progress fields
  db.progress[userEmail] = Object.assign({}, db.progress[userEmail], payload);
  saveDB(db);
  res.json({ success: true, progress: db.progress[userEmail] });
});

app.listen(PORT, () => {
  console.log(`LeadHub server running on http://localhost:${PORT}`);
});
