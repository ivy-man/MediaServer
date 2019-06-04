// eslint-disable-next-line no-unused-vars
module.exports = async (fastify, options) => {
  const { uploadHandlers } = fastify;

  fastify.post('/upload/images', uploadHandlers.imageHandler);

  fastify.delete('/delete/images', uploadHandlers.deleteHandler);

  fastify.post('/get/images', uploadHandlers.downloadHandler);

  fastify.post('/get/ownerResource/images', uploadHandlers.downloadResorceHandler);

  fastify.post('/get/image/specifications', uploadHandlers.specificationsHandlre);
};
