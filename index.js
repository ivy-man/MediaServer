// Require the framework and instantiate it
const fastify = require('fastify')({ logger: false });
require('dotenv').config();

fastify.register(require('./db-connector'), {
  url: 'mongodb://localhost:27017/'
});

fastify.register(require('./routes'));

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000);
    console.log(`server listening on ${process.env.APPLICATION_PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
start();