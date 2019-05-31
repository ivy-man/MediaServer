/* eslint-disable linebreak-style */
const ClientError = require('../../core/types/ClientError');
const { maxPageSize } = require('./configs').constants.pagination;

module.exports = async (fastify, opts) => {
  const httpHandlers = {
    addBusinessHdateHandler: async (req, reply) => {
      if (req.validationError) {
        const error = req.validationError.details;

        throw new ClientError(error, { message: 'خطا در اعتبار سنجی اطلاعات' }, 400);
      }
      const businessHdateObj = req.body;
      const result = await fastify.logics.add(businessHdateObj);
      reply.status(201).send(result);
    },
    removeBusinessHdateHandler: async (req, reply) => {
      if (req.validationError) {
        const error = req.validationError.details;

        throw new ClientError(error, { message: 'خطا در اعتبار سنجی اطلاعات' }, 400);
      }
      const { businessHdateId } = req.params;

      await fastify.logics.remove(businessHdateId);
      reply.status(200).send();
    },
    getBusinessHdateHandler: async (req, reply) => {
      if (req.validationError) {
        const error = req.validationError.details;

        throw new ClientError(error, { message: 'خطا در اعتبار سنجی اطلاعات' }, 400);
      }
      const { businessHdateId } = req.params;
      const result = await fastify.logics.get(businessHdateId);

      reply.status(200).send(result);
    },
  };

  const webSocketHandlers = {
  };

  fastify.decorate('httpHandlers', httpHandlers);
  fastify.decorate('webSocketHandlers', webSocketHandlers);
};
