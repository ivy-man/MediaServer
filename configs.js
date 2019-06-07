module.exports = {
  rateLimits: {
    max: 20,
    timeWindow: '1 minute',
  },
  multipartLimits: {
    // fieldNameSize: 100, // Max field name size in bytes
    // fieldSize: 1000, // Max field value size in bytes
    // fields: 2, // Max number of non-file fields
    fileSize: 10000000, // For multipart forms, the max file size
    files: 1, // Max number of file fields
    // headerPairs: 2000   // Max number of header key=>value pairs
  },
};
