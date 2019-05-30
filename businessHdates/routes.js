const { businessHdateForAddSchema, businessHdateForGetSchema, businessHdateForRemoveSchema } = require( "./schemas" ),
    joi = require( "@hapi/joi" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.post( "/",
        {
            "schema": businessHdateForAddSchema,
            "attachValidation": true,
            "schemaCompiler": schema => data => joi.validate( data, schema ),
            "preHandler": [
                fastify.authenticate,
                fastify.authorizeByRoles( [ "provider" ] ),
                fastify.checkResourceExist( "Business", fastify, ( req ) => req.body.businessId, "چنین کسب و کاری ثبت نشده است" ),
                fastify.authorizeProviderByResourceOwner( fastify, ( req ) => ( { "businessId": req.body.businessId } ) )
            ]
        }, httpHandlers.addBusinessHdateHandler );

    fastify.delete( "/:businessHdateId",
        {
            "schema": businessHdateForRemoveSchema,
            "attachValidation": true,
            "schemaCompiler": schema => data => joi.validate( data, schema ),
            "preHandler": [
                fastify.authenticate,
                fastify.authorizeByRoles( [ "provider" ] ),
                fastify.checkResourceExist( "BusinessHdate", fastify, ( req ) => req.params.businessHdateId, "چنین روز تعطیلی ثبت نشده است" ),
                fastify.authorizeProviderByResourceOwner( fastify, ( req ) => ( { "businessHdateId": req.params.businessHdateId } ) )
            ]
        }, httpHandlers.removeBusinessHdateHandler );

    fastify.get( "/:businessHdateId",
        {
            "schema": businessHdateForGetSchema,
            "attachValidation": true,
            "schemaCompiler": schema => data => joi.validate( data, schema )
        }, httpHandlers.getBusinessHdateHandler );
};
