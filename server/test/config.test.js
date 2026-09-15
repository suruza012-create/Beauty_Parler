const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('required deployment template exists', () => {
  const envExample = path.join(__dirname, '..', '.env.example');
  assert.equal(fs.existsSync(envExample), true);
  const contents = fs.readFileSync(envExample, 'utf8');
  assert.match(contents, /^MONGO_URI=/m);
  assert.match(contents, /^JWT_SECRET=/m);
  assert.match(contents, /^CLIENT_ORIGINS=/m);
});

test('upload directory exists', () => {
  assert.equal(fs.existsSync(path.join(__dirname, '..', 'uploads')), true);
});
