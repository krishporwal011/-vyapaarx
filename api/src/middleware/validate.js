const { ZodError } = require('zod');
const AppError = require('../utils/AppError');

const validate = (schema) => (req, res, next) => {
  try {
    // Validate request body, query, and params against the provided Zod schema
    const validData = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    // Replace the request data with the validated/sanitized data
    req.body = validData.body;
    req.query = validData.query;
    req.params = validData.params;

    next();
  } catch (err) {
    if (err instanceof ZodError) {
      // Format Zod errors into a readable structure
      const errorMessage = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return next(new AppError(`Validation Error: ${errorMessage}`, 400));
    }
    next(err);
  }
};

module.exports = validate;
