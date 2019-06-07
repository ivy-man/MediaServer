/* eslint-disable no-use-before-define */
const pump = require('pump');
const fs = require('fs');
const mkdirp = require('mkdirp');
const sharp = require('sharp');
const path = require('path');
const uuidv1 = require('uuid/v1');
const picModel = require('./model/picModel');

function getDirImage() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();

  return `uploads/images/${year}/${month}/${day}`;
}

module.exports = async (fastify) => {
  const Pic = picModel.init(fastify.sequelize);

  const uploadHandlers = {
    imageHandler: async (req, res) => {
      try {
        const input = {};
        const files = [];
        const mp = req.multipart(handler, done, (err) => {
          if (err) throw new Error(err);
        });
        if (!mp) res.code(422).send('No file to upload!');

        function done() {
          files.forEach(async (file, index) => {
            try {
              if (!input.ownerResourceUUID) {
                fs.unlinkSync(`${file.imagePath}/${file.imageName}`);
                res.code(422).send('Unprocessable Entity!');
                return;
              }

              await fastify.sequelize.sync();
              await Pic.create({
                url: `${file.imagePath}/${file.imageName}`.substring(8),
                name: file.imageName,
                ownerResourceUUID: input.ownerResourceUUID,
                imageID: uuidv1(),
                createdAt: new Date(),
              });

              if (index + 1 === files.length) { res.code(200).send({ message: 'file uploaded' }); }
            } catch (e) {
              console.error(e);
              fs.unlinkSync(`${file.imagePath}/${file.imageName}`);
              res.code(500).send('Internal Server Error');
            }
          });
        }

        mp.on('field', (key, value) => {
          input[key] = value;
        });

        // eslint-disable-next-line no-unused-vars
        function handler(field, file, filename, encoding, mimetype) {
          // file.on('limit', () => console.log('File size limit reached'));

          const dir = getDirImage();
          mkdirp(dir, (err) => {
            if (err) throw new Error(err);

            const filePath = `${getDirImage()}/${filename}`;
            if (fs.existsSync(filePath)) {
              // eslint-disable-next-line no-param-reassign
              filename = `${Date.now()}-${filename}`;
            }

            files.push({ imageName: filename, imagePath: dir });
            pump(file, fs.createWriteStream(`${dir}/${filename}`));
          });
        }
      } catch (e) {
        console.error(e);
        res.code(500).send('internal server error');
      }
    },
    deleteHandler: async (req, res) => {
      try {
        const result = await Pic.findByPk(req.body.imageID);
        if (result) {
          fs.unlinkSync(`uploads/${result.dataValues.url}`);
          const deleteResult = Pic.destroy({
            where: { imageID: req.body.imageID },
          });
          if (deleteResult) {
            res.code(200).send('ok');
          } else {
            res.code(408).send('An error has occurred');
          }
        } else {
          res.code(403).send('not found');
        }
      } catch (e) {
        res.code(500).send('internal server error');
      }
    },
    downloadHandler: async (req, res) => {
      try {
        const result = await Pic.findOne({
          where: { imageID: req.query.imageID },
        });
        if (result) {
          res.sendFile(result.dataValues.url);
        } else {
          res.code(403).send('not found');
        }
      } catch (e) {
        res.code(500).send('internal server error');
      }
    },
    getResourceHandler: async (req, res) => {
      try {
        const result = await Pic.findAll({
          where: { ownerResourceUUID: req.query.ownerResourceUUID },
        });
        if (result) {
          res.code(200).send(result);
        } else {
          res.code(403).send('not found');
        }
      } catch (e) {
        res.code(500).send('internal server error');
      }
    },
    specificationsHandler: async (req, res) => {
      try {
        const { imageID } = req.query;
        const result = await Pic.findByPk(imageID);
        if (result) {
          res.code(200).send(result.dataValues);
        } else {
          res.code(403).send('not found');
        }
      } catch (e) {
        res.code(500).send('internal server error');
      }
    },
    imageResizeHandler: async (req, res) => {
      try {
        const result = await Pic.findByPk(req.query.imageID);
        if (result) {
          const splitSize = (req.query.size).split('*');
          const imageInfo = path.parse(`${result.dataValues.url}`);
          const imageName = `${imageInfo.name}-q${splitSize[0]}*${splitSize[1]}${imageInfo.ext}`;
          const imageAddress = `${imageInfo.dir}/${imageName}`;

          const resize = await sharp(`uploads/${result.dataValues.url}`)
            .resize(parseInt(splitSize[0], 10), null)
            .resize(null, parseInt(splitSize[1], 10))
            .toFile(`uploads/${imageAddress}`);
          if (resize) {
            res.sendFile(`${imageAddress}`);
          } else {
            res.code(408).send('An error has occurred');
          }
          setTimeout(() => {
            // fs.unlinkSync(`uploads/${resize}`);
          }, 2000);
        } else {
          res.code(403).send('not found');
        }
      } catch (e) {
        res.code(500).send('internal server error');
      }
    },
    imageCompressHandler: async (req, res) => {
      try {
        const { imageID, quality } = req.query;
        const result = await Pic.findByPk(imageID);
        if (result) {
          const imageInfo = path.parse(`${result.dataValues.url}`);
          const imageName = `${imageInfo.name}-q${quality}${imageInfo.ext}`;
          const imageAddress = `${imageInfo.dir}/${imageName}`;

          const compress = await sharp(`uploads/${result.dataValues.url}`)
            .jpeg({ quality: parseInt(quality, 10) })
            .toFile(`uploads/${imageAddress}`);
          if (compress) {
            res.sendFile(`${imageAddress}`);
          } else {
            res.code(408).send('An error has occurred');
          }
          setTimeout(() => {
            // fs.unlinkSync(`uploads/${resize}`);
          }, 2000);
        } else {
          res.code(403).send('not found');
        }
      } catch (e) {
        res.code(500).send('internal server error');
      }
    },
  };

  fastify.decorate('uploadHandlers', uploadHandlers);
};
