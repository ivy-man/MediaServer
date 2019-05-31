/* eslint-disable no-use-before-define */
const pump = require('pump');
const fs = require('fs');
const mkdirp = require('mkdirp');
const sharp = require('sharp');
const path = require('path');
const picModel = require('./model/picModel');

function getDirImage() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const day = new Date().getDay();

  return `uploads/images/${year}/${month}/${day}`;
}

function imageResize(dir, filename) {
  const imageInfo = path.parse(`${dir}/${filename}`);
  const filePath = (`${dir}/${filename}`);
  const addressImages = {};
  addressImages.original = `${dir}/${filename}`;

  const resize = (size) => {
    const imageName = `${imageInfo.name}-${size}${imageInfo.ext}`;
    addressImages[size] = `${dir}/${imageName}`;

    sharp(filePath)
      .resize(size, null)
      .toFile(`${dir}/${imageName}`);
  };

  [1080, 720, 480].map(resize);

  return addressImages;
}

module.exports = async (fastify) => {
  const Pic = picModel.init(fastify.sequelize);

  const uploadHandlers = {
    imageHandler: async (req, res) => {
      // console.log(req);
      const mp = req.multipart(handler, (err) => {
        if (err) throw new Error(err);
      });

      mp.on('field', (key, value) => {
        // eslint-disable-next-line no-console
        console.log('form-data', key, value);
      });

      // eslint-disable-next-line no-unused-vars
      function handler(field, file, filename, encoding, mimetype) {
        const dir = getDirImage();
        mkdirp(dir, (err) => {
          if (err) throw new Error(err);

          const filePath = `${getDirImage()}/${filename}`;
          if (fs.existsSync(filePath)) { filename = `${Date.now()}-${filename}`; }

          pump(file, fs.createWriteStream(`${dir}/${filename}`));
          setTimeout(() => {
            imageResize(dir, filename);
          }, 2000);

          fastify.sequelize.sync()
            .then(() => Pic.create({
              url: `${dir}/${filename}`,
              owner: 1,
              createdAt: new Date(),
              // updatedAt: new Date()
            }))
            .then(() => {
              res.code(200).send({ message: 'file uploaded' });
            });
          // .catch(() => {
          //   fs.unlinkSync(req.file.path, (err) => {
          //     return this.back(req, res);
          //   });
          // });
        });
      }
    },
  };

  fastify.decorate('uploadHandlers', uploadHandlers);
};
