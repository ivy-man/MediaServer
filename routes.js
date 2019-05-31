"use strict";

async function routes(fastify, options) {
    const Pic = require('./model/picModel').init(fastify.sequelize);
    // const database = fastify.mongo.db('db')
    // const collection = database.collection('test')

    fastify.post('/', async (request, reply) => {
        fastify.sequelize.sync()
            .then(() => Pic.create({
                url: 'asdlkasndlkasndlaskdnlksadnlaskdn',
                owner: 1,
                // createdAt: new Date(),
                // updatedAt: new Date()
            }))
            .then(res => {
                console.log(res.toJSON());
            });
    });

    fastify.get('/', async (request, reply) => {
        return {hello: 'world'}
    });

    fastify.get('/search/:id', async (request, reply) => {
        const result = await collection.findOne({id: request.params.id});
        if (result === null) {
            throw new Error('Invalid value')
        }
        console.log(result);
        reply.send(result);
    });
}

module.exports = routes;