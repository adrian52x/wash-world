jest.mock('../src/logger/logger.middleware', () => ({
  LoggerMiddleware: class {
    use(req, res, next) {
      next();
    }
  },
}));
