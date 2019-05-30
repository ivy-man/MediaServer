"use strict";
const ClientError = require( "../../core/types/ClientError" );

class Logics {
    constructor( { models, sequelizeObj }, sequelizeCachingUtil ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
    }

    async add( businessHdateObj ) {
        return await this.sequelizeCachingUtil.withCache( this.models.BusinessHdate ).cache().create( businessHdateObj );
    }

    async remove( businessHdateId ) {
        const businessHdate = await this.sequelizeCachingUtil.withCache( this.models.BusinessHdate ).cache().findByPk( businessHdateId );
       
        if ( !businessHdate ) {
            throw new ClientError( "چنین روز تطیلی ثبت نشده است", { "message": "خطا در اعتبار سنجی اطلاعات" }, 404 );
        }
        await businessHdate.cache().destroy();
    }

    async get( businessHdateId ) {
        return await this.sequelizeCachingUtil.withCache( this.models.BusinessHdate ).cache().findByPk( businessHdateId );
    }
}

module.exports = Logics;
