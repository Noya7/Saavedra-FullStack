const {storage} = require('./firebase')
const {v4} = require('uuid');
const HttpError = require('../models/Http-Error')

//profile image upload, takes an image for argument and uploads it.

const estateImageUpload = async (files, estateId) => {
    try {
        if (!files.length) throw new HttpError('No se proporcionó ningún archivo.', 400);
        const bucket = storage.bucket();
        const imageUrls = [];

        const uploadPromises = files.map((file) => {
            const image = bucket.file(`estate_pictures/${estateId}/${v4()}`);
            const stream = image.createWriteStream({ metadata: { contentType: file.mimetype } });

            return new Promise((resolve, reject) => {
                stream.on('error', err => {
                    reject(new HttpError('Ocurrió un error inesperado al subir la imagen. Error: ' + err.message, 500));
                });

                stream.on('finish', async () => {
                    await image.makePublic();
                    const url = `https://storage.googleapis.com/${bucket.name}/${image.name}`;
                    imageUrls.push(url);
                    resolve();
                });

                stream.end(file.buffer);
            });
        });

        await Promise.all(uploadPromises);
        return imageUrls;
    } catch (err) {
        throw new HttpError('Ocurrió un error inesperado al subir las imagenes. Error: ' + err.message, 500);
    }
};

const deleteImages = async (estateId) => {
    try {
        // Obtener lista de archivos en la carpeta:
        const [files] = await storage.bucket().getFiles({prefix: `estate_pictures/${estateId}`});
        // Iterar y eliminar:
        await Promise.all(files.map( async file => await file.delete() ));
    } catch (err) {
        return err;
    }
};

module.exports = {estateImageUpload, deleteImages}