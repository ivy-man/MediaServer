// eslint-disable-next-line no-unused-vars
module.exports = async (fastify, options) => {
  const { uploadHandlers } = fastify;

  fastify.get('/', async (request, reply) => {
    reply.send({ hello: 'world' });
  });

  fastify.post('/upload/images', uploadHandlers.imageHandler);
};
