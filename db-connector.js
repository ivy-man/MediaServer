const fastifyPlugin = require('fastify-plugin');
const Sequelize = require('sequelize');

async function dbConnector(fastify, options) {
  try {
    const {url} = options;
    delete options.url;

    const db = await new Sequelize('postgres', 'postgres', '1430666', {
      host: 'localhost',
      dialect: 'postgres',
      define: {
        timestamps: false,
      },
    });

    fastify.decorate('sequelize', db);
  } catch (e) {
    fastify.log.error(e);
    throw new Error(e);
  }
}

// Wrapping a plugin function with fastify-plugin exposes the decorators,
// hooks, and middlewares declared inside the plugin to the parent scope.

module.exports = fastifyPlugin(dbConnector);
