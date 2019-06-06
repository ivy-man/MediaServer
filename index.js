const fastify = require('fastify')({ logger: false });
const fastifyPlugin = require('fastify-plugin');
const rateLimit = require('fastify-rate-limit');
const path = require('path');
const handlers = require('./handlers');
const config = require('./configs');

require('dotenv').config();

fastify.register(require('./db-connector'), {
  url: 'postgres://postgres:1430666@localhost:5432/postgres',
});

fastify.register(rateLimit, config.rateLimits);

fastify.register(require('fastify-formbody'));
fastify.register(require('fastify-multipart'), {
  limits: config.multipartLimits,
});

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'uploads'),
  prefix: '/uploads/', // optional: default '/'
});

fastify.register(fastifyPlugin(handlers));
fastify.register(require('./routes'));

// Run the server!
const start = async () => {
  try {
    await fastify.listen(process.env.APPLICATION_PORT);
    // eslint-disable-next-line no-console
    console.log(`server listening on ${process.env.APPLICATION_PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
