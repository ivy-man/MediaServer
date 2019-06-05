// eslint-disable-next-line no-unused-vars
module.exports = async (fastify, options) => {
  const { uploadHandlers } = fastify;

  fastify.post('/upload/images', uploadHandlers.imageHandler);

  fastify.delete('/delete/images', uploadHandlers.deleteHandler);

  fastify.post('/get/images', uploadHandlers.downloadHandler);

  fastify.post('/get/ownerResource/images', uploadHandlers.getResorceHandler);

  fastify.post('/get/image/specifications', uploadHandlers.specificationsHandler);

  fastify.post('/get/image/resize', uploadHandlers.imageResizeHandler);

  fastify.post('/get/image/compress', uploadHandlers.imageCompressHandler);
};
