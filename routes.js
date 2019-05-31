// eslint-disable-next-line no-unused-vars
module.exports = async (fastify, options) => {
  const { uploadHandlers } = fastify;


  fastify.get('/', async (request, reply) => {
    reply.send({ hello: 'world' });
  });

  // fastify.post('/eli', async (request, reply) => {
  //   // reply.send(request.body);
  //   console.log(request.body);
  // });

  fastify.post('/upload/images', uploadHandlers.imageHandler);
};
