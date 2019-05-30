"use strict";

async function routes(fastify, options) {

    const database = fastify.mongo.db('db')
    const collection = database.collection('test')

    fastify.get('/', async (request, reply) => {
        return {hello: 'world'}
    });

    fastify.get('/search/:id', async (request, reply) => {
        const result = await collection.findOne({id: request.params.id})
        if (result === null) {
            throw new Error('Invalid value')
        }
        console.log(result)
        reply.send(result);
    });
}

module.exports = routes