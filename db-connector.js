const fastifyPlugin = require('fastify-plugin');
const Sequelize = require('sequelize');

async function dbConnector(fastify) {
  try {
    const db = await new Sequelize(
      process.env.DATABASE,
      process.env.DATABASE_USER,
      process.env.DATABASE_PASSWORD, {
        host: 'localhost',
        dialect: 'postgres',
        define: {
          timestamps: false,
        },
      },
    );

    fastify.decorate('sequelize', db);
  } catch (e) {
    fastify.log.error(e);
    throw new Error(e);
  }
}

// Wrapping a plugin function with fastify-plugin exposes the decorators,
// hooks, and middlewares declared inside the plugin to the parent scope.

module.exports = fastifyPlugin(dbConnector);
