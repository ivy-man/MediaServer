const fastify = require('fastify')({ logger: false });
const fastifyPlugin = require('fastify-plugin');
const handlers = require('./handlers');
const path = require('path');

require('dotenv').config();

fastify.register(require('./db-connector'), {
  url: 'postgres://postgres:1430666@localhost:5432/postgres',
});

fastify.register(require('fastify-formbody'));
fastify.register(require('fastify-multipart'));

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'uploads'),
  prefix: '/uploads/', // optional: default '/'
});

fastify.register(fastifyPlugin(handlers));
fastify.register(require('./routes'));

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000);
    // eslint-disable-next-line no-console
    console.log(`server listening on ${process.env.APPLICATION_PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
