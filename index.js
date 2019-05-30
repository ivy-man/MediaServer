// Require the framework and instantiate it
const fastify = require('fastify')({ logger: false }),
    fastifyPlugin = require("fastify-plugin"),
    handlers = require("./handlers");
require('dotenv').config();

fastify.register(require('./db-connector'), {
    url: 'postgres://postgres:1430666@localhost:5432/postgres'
});

fastify.register(require('fastify-multipart'));
fastify.register(fastifyPlugin(handlers));
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
};

start();
