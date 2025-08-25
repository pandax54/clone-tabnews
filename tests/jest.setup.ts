module.exports = async () => {
  // This runs once before all tests
  (process.env as any).NODE_ENV = 'development';
  console.log('Global setup: NODE_ENV set to', process.env.NODE_ENV);
};
