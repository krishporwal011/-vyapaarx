const { z } = require('zod');

const getRevenueSchema = z.object({
  query: z.object({
    period: z.string().optional().transform(val => (val ? parseInt(val, 10) : 30)),
  }),
});

module.exports = {
  getRevenueSchema,
};
