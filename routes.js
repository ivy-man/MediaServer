"use strict";

module.exports = async (fastify, options) => {

    const { uploadHandlers } = fastify;

    fastify.post('/', async (request, reply) => {
        
    });

    fastify.get('/', async (request, reply) => {
        return { hello: 'world' }
    });

    fastify.post('/upload/images', uploadHandlers.imageHandler);

}