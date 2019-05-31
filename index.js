const fastify = require('fastify')({ logger: false });
const fastifyPlugin = require('fastify-plugin');
const handlers = require('./handlers');

require('dotenv').config();

fastify.register(require('./db-connector'), {
  url: 'postgres://postgres:1430666@localhost:5432/postgres',
});

// fastify.addContentTypeParser('*', (req, done) => {
//   let data = '';
//   req.on('data', (chunk) => { data += chunk; });
//   req.on('end', () => {
//     done(null, data);
//   });
// });

fastify.register(require('fastify-multipart'));

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
