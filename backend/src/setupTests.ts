// Setup file for Jest tests
beforeAll(() => {
  process.env.NODE_ENV = 'test';
  process.env.DB_URI = 'mongodb://localhost:27017/project-tracker-test';
});

afterAll(() => {
  process.env.NODE_ENV = 'development';
});
