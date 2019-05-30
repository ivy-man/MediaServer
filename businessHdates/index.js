"use strict";
const fastifyPlugin = require( "fastify-plugin" ),
    Logics = require( "./logics" ),
    handlers = require( "./handlers" ),
    routes = require( "./routes" );

module.exports = async function( fastify, opts ) {
    fastify.register( fastifyPlugin( async( fastify, opts ) => {
        const logics = new Logics( fastify.dbClient, fastify.sequelizeCachingUtil );

        fastify.decorate( "logics", logics );
    } ) );

    fastify.register( fastifyPlugin( handlers ) );

    fastify.register( routes );

    fastify.setErrorHandler( async( err, req, reply ) => {
        await fastify.errorHandler( err, req, reply );
    } );
};

