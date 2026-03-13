// Async handler wrapper để không phải try/catch lặp lại trong controller
module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

