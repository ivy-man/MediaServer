const baseJoi = require( "@hapi/joi" ),
    dateExtension = require( "@hapi/joi-date" ),
    joi = baseJoi.extend( dateExtension ),
    { maxPageSize } = require( "./configs" ).constants.pagination;

module.exports = {
    "businessHdateForAddSchema": {
        "body": joi.object().keys( {
            "date": joi.date().format( "YYYY-MM-DD" ).raw().required(),
            "description": joi.string().min( 5 ),
            "businessId": joi.number().integer().min( 1 ).required()
        } ).required()
    },
    "businessHdateForRemoveSchema": {
        "params": joi.object().keys( {
            "businessHdateId": joi.number().integer().min( 1 ).required()
        } ).required()
    },
    "businessHdateForGetSchema": {
        "params": joi.object().keys( {
            "businessHdateId": joi.number().integer().min( 1 ).required()
        } ).required()
    }
};
