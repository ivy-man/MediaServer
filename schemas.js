const baseJoi = require('@hapi/joi');
const dateExtension = require("@hapi/joi-date");
const joi = baseJoi.extend(dateExtension);

module.exports = {
  uploadSchema: {
    body: joi.object().keys({
      ownerResourceUUID: joi.number().integer().min(1).required(),
    }).required(),
  },
};
