const server = require('./server');

test('sanity', () => {
  expect(false).toBe(false); // This should pass
});

// Add other server tests here
test('server exists', () => {
  expect(server).toBeTruthy();
});
