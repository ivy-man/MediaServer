"use strict";

const pump = require('pump');
const fs = require('fs');
const mkdirp = require('mkdirp');
const sharp = require('sharp');
const path = require('path');

module.exports = async (fastify, opts) => {
    const Pic = require('./model/picModel').init(fastify.sequelize);

    const uploadHandlers = {
        "imageHandler": async (req, res) => {

            const mp = req.multipart(handler, function (err) {

                res.code(200).send({ message: 'file uploaded' });
            });

            function handler(field, file, filename, encoding, mimetype) {

                let dir = getDirImage()
                mkdirp(dir, (err) => {
                    if (err) console.log(err);

                    let filePath = getDirImage() + '/' + filename;
                    if (fs.existsSync(filePath))
                        filename = Date.now() + '-' + filename;

                    pump(file, fs.createWriteStream(`${dir}/${filename}`));
                    setTimeout(() => {
                        let images = imageResize(dir, filename);
                    }, 2000);
                    
                    fastify.sequelize.sync()
                        .then(() => Pic.create({
                            url: `${dir}/${filename}`,
                            owner: 1,
                            createdAt: new Date(),
                            // updatedAt: new Date()
                        }))
                        .then(res => {
                            console.log(res.toJSON());
                        });
                });
            }

            function getDirImage() {
                let year = new Date().getFullYear();
                let month = new Date().getMonth() + 1;
                let day = new Date().getDay();

                return `uploads/images/${year}/${month}/${day}`;
            };

            function imageResize(dir, filename) {
                console.log(typeof `${dir}/${filename}`)
                const imageInfo = path.parse(`${dir}/${filename}`);
                let filePath = (dir + '/' + filename);
                let addressImages = {};
                addressImages['original'] = `${dir}/${filename}`;

                const resize = size => {

                    let imageName = `${imageInfo.name}-${size}${imageInfo.ext}`;
                    addressImages[size] = `${dir}/${imageName}`;

                    sharp(filePath)
                        .resize(size, null)
                        .toFile(`${dir}/${imageName}`);
                }

                [1080, 720, 480].map(resize)

                return addressImages;

            };
        }
    };

    fastify.decorate("uploadHandlers", uploadHandlers);
};
