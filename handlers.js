/* eslint-disable no-use-before-define */
const pump = require('pump');
const fs = require('fs');
const mkdirp = require('mkdirp');
const sharp = require('sharp');
const path = require('path');
const picModel = require('./model/picModel');
const uuidv1 = require('uuid/v1');

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

          const write = fs.createWriteStream(`${dir}/${filename}`);
          pump(file, write);

          write.on('close', () => {
            console.log('here');
            fastify.sequelize.sync()
              .then(() => Pic.create({
                url: `${dir}/${filename}`,
                owner: 1,
                createdAt: new Date(),
                imageID: uuidv1()

                // updatedAt: new Date()
              }))
              .then(() => {
                const images = imageResize(dir, filename);
                res.code(200).send({ message: 'file uploaded' });
              })
              .catch((e) => {
                console.log(e)
                fs.unlinkSync(`${dir}/${filename}`);
              });
          });
        });
      }
    },
    deleteHandler: async (req, res) => {
      fastify.sequelize.sync()
        .then(() => Pic.findOne({
          where: { id: req.body.id },
        }))
        .then((result) => {
          if (result) {
            fs.unlinkSync(result.dataValues.url);
            fastify.sequelize.sync()
              .then(() => Pic.destroy({
                where: { id: req.body.id },
              }))
              .then(deleteResult => res.status(200).send({
                success: 'true',
                message: deleteResult,
              }));
          } else {
            res.status(403).send({
              success: 'false',
              message: 'not found',
            });
          }
        });
    },
    downloadHandler: async (req, res) => {
      // res.sendFile('/images/2019/6/6/fantastic-fairy.jpg');

      fastify.sequelize.sync()
        .then(() => Pic.findOne({
          where: { imageID: req.body.imageID },
        }))
        .then((result) => {
          if (result) {
            console.log(result.dataValues.url.substring(8))
            res.sendFile(result.dataValues.url.substring(8));
          } else {
            res.status(403).send({
              success: 'false',
              message: 'not found',
            });
          }
        });
    }
  };

  fastify.decorate('uploadHandlers', uploadHandlers);
};
