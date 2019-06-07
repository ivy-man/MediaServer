// eslint-disable-next-line no-unused-vars
module.exports = async (fastify, options) => {
  const { uploadHandlers } = fastify;

  fastify.post('/upload/images', uploadHandlers.imageHandler);

  fastify.delete('/image', uploadHandlers.deleteHandler);

  fastify.get('/images', uploadHandlers.downloadHandler);

  fastify.get('/ownerResource/images', uploadHandlers.getResourceHandler);

  fastify.get('/image/specifications', uploadHandlers.specificationsHandler);

  fastify.put('/image/resize', uploadHandlers.imageResizeHandler);

  fastify.put('/image/compress', uploadHandlers.imageCompressHandler);
};
