// eslint-disable-next-line no-unused-vars
module.exports = async (fastify, options) => {
  const { uploadHandlers } = fastify;

  fastify.post('/upload/images', uploadHandlers.imageHandler);

  fastify.delete('/delete/image', uploadHandlers.deleteHandler);

  fastify.get('/get/images', uploadHandlers.downloadHandler);

  fastify.get('/get/ownerResource/images', uploadHandlers.getResorceHandler);

  fastify.get('/get/image/specifications', uploadHandlers.specificationsHandler);

  fastify.put('/create/image/resize', uploadHandlers.imageResizeHandler);

  fastify.put('/create/image/compress', uploadHandlers.imageCompressHandler);
};
