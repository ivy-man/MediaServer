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
    const day = new Date().getDate();

    return `uploads/images/${year}/${month}/${day}`;
}

function imageResize(dir, filename) {
    return new Promise((resolve, reject) => {
        try {
            const imageInfo = path.parse(`${dir}/${filename}`);
            const filePath = (`${dir}/${filename}`);
            const addressImages = {};
            addressImages.original = `${dir}/${filename}`;

            const resize = (size) => {
                const imageName = `${imageInfo.name}-${size}${imageInfo.ext}`;
                addressImages[size] = `${dir}/${imageName}`;

                sharp(filePath)
                    .resize(size, null)
                    .toFile(`${dir}/${imageName}`)
                    .catch(e => {
                        reject(e);
                    });
            };

            [1080, 720, 480].map(resize);

            resolve(addressImages);
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = async (fastify) => {
    const Pic = picModel.init(fastify.sequelize);

    const uploadHandlers = {
        imageHandler: async (req, res) => {
            let input = {},
                imagePath, imageName;
            const mp = req.multipart(handler, done, (err) => {
                if (err) throw new Error(err);
            });
            if (!mp) res.code(422).send('No file to upload!');

            function done() {
                if (!input.ownerResourceUUID) {
                    res.code(422).send('Unprocessable Entity!');
                    return;
                }
                fastify.sequelize.sync()
                    .then(() => Pic.create({
                        url: `${imagePath}/${imageName}`.substring(8),
                        owner: 1,
                        ownerResourceUUID: input.ownerResourceUUID,
                        createdAt: new Date(),
                        imageID: uuidv1()
                    }))
                    .then(() => {
                        return imageResize(imagePath, imageName);
                    })
                    .then(() => {
                        res.code(200).send({message: 'file uploaded'});
                    })
                    .catch((e) => {
                        fs.unlinkSync(`${imagePath}/${imageName}`);
                        res.code(500).send('Internal Server Error');
                    });
            }

            mp.on('field', (key, value) => {
                input[key] = value;
            });

            // eslint-disable-next-line no-unused-vars
            function handler(field, file, filename, encoding, mimetype) {
                file.on('limit', () => console.log('File size limit reached'));

                const dir = getDirImage();
                mkdirp(dir, (err) => {
                    if (err) throw new Error(err);

                    const filePath = `${getDirImage()}/${filename}`;
                    if (fs.existsSync(filePath)) {
                        filename = `${Date.now()}-${filename}`;
                    }
                    imagePath = dir;
                    imageName = filename;
                    pump(file, fs.createWriteStream(`${dir}/${filename}`));
                });
            }
        },
        deleteHandler: async (req, res) => {
            fastify.sequelize.sync()
                .then(() => Pic.findOne({
                    where: {imageID: req.body.imageID},
                }))
                .then((result) => {
                    if (result) {
                        fs.unlinkSync(`uploads/${result.dataValues.url}`);
                        fastify.sequelize.sync()
                            .then(() => Pic.destroy({
                                where: {imageID: req.body.imageID},
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
            fastify.sequelize.sync()
                .then(() => Pic.findOne({
                    where: {imageID: req.body.imageID},
                }))
                .then((result) => {
                    if (result) {
                        res.sendFile(result.dataValues.url);
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
