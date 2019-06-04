const baseJoi = require( "@hapi/joi" ),
    dateExtension = require( "@hapi/joi-date" ),
    joi = baseJoi.extend( dateExtension );

module.exports = {
        "uploadSchema": {
        "body": joi.object().keys( {
            "ownerResourceUUID": joi.number().integer().min( 1 ).required()
        } ).required()
    },
    "businessHdateForRemoveSchema": {
        "querystring": joi.object().keys( {
            "businessHdateId": joi.number().integer().min( 1 ).required(),
            "date": joi.date().format( "YYYY-MM-DD" ).raw().required(),
            "description": joi.string().min( 5 ),
            "businessId": joi.number().integer().min( 1 ).required()
        } ).required()
    },
    "businessHdateForGetSchema": {
        "params": joi.object().keys( {
            "businessHdateId": joi.number().integer().min( 1 ).required()
        } ).required()
    }
};
