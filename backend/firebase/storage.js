const {storage} = require('./firebase')
const {v4} = require('uuid');
const HttpError = require('../models/Http-Error')

const estateImageUpload = async (files, estateId) => {
    try {
        if (!files.length) throw new HttpError('No se proporcionó ningún archivo.', 400);
        const cloudFunctionUrl = `https://${process.env.FIREBASE_REGION}-${process.env.FIREBASE_PROJECT_ID}.cloudfunctions.net/processAndUploadImages`;
        const formData = new FormData();
        formData.append('estateId', estateId);
        files.forEach((file, index) => {
            formData.append(`image${index}`, new Blob([file.buffer], { type: file.mimetype }), file.originalname);
        });
        const response = await fetch(cloudFunctionUrl, {body: formData, method: 'POST'})
        if (!response.ok) {
            throw new HttpError(`Error al procesar las imágenes en la Cloud Function: ${response.statusText}`, response.status);
        }
        const data = await response.json();
        return data.imageUrls;
    } catch (err) {
        throw new HttpError('Ocurrió un error inesperado al subir las imágenes. Error: ' + err.message, 500);
    }
};

const deleteImages = async (estateId, imagesToDelete) => {
    try {
        const bucket = storage.bucket();
        const files = await Promise.all(
            imagesToDelete.map(imageUrl => {
                const fileName = imageUrl.split('/').pop();
                return bucket.file(`estate_pictures/${estateId}/${fileName}`);
            })
        );
        await Promise.all(files.map(async file => await file.delete()));
    } catch (err) {
        console.error('Error deleting images:', err);
        throw new Error(`Failed to delete images: ${err.message}`);
    }
};

const deleteAllImages = async (estateId) => {
    try {
        const [files] = await storage.bucket().getFiles({prefix: `estate_pictures/${estateId}`});
        await Promise.all(files.map( async file => await file.delete() ));
    } catch (err) {
        return err;
    }
};

module.exports = {estateImageUpload, deleteImages, deleteAllImages}
//     try {
//         if (!files.length) throw new HttpError('No se proporcionó ningún archivo.', 400);
//         const bucket = storage.bucket();
//         const imageUrls = [];
//         const uploadPromises = files.map((file) => {
//             return new Promise(async (resolve, reject) => {
//                 try {
//                     const imageFile = await jimp.read(file.buffer);
//                     imageFile.resize(1024, jimp.AUTO).quality(80);
//                     const buffer = await imageFile.getBufferAsync(jimp.MIME_JPEG);
//                     const image = bucket.file(`estate_pictures/${estateId}/${v4()}`);
//                     const stream = image.createWriteStream({
//                         resumable: true,
//                         validation: 'crc32c',
//                         metadata: { contentType: jimp.MIME_JPEG },
//                     });
//                     stream.on('error', err => {
//                         reject(new HttpError('Ocurrió un error inesperado al subir la imagen. Error: ' + err.message, 500));
//                     });
//                     stream.on('finish', async () => {
//                         await image.makePublic();
//                         const url = `https://storage.googleapis.com/${bucket.name}/${image.name}`;
//                         imageUrls.push(url);
//                         resolve();
//                     });
//                     stream.end(buffer);
//                 } catch (err) {
//                     reject(new HttpError('Ocurrió un error inesperado al procesar la imagen. Error: ' + err.message, 500));
//                 }
//             });
//         });
//         await Promise.all(uploadPromises);
//         return imageUrls;
//     } catch (err) {
//         throw new HttpError('Ocurrió un error inesperado al subir las imagenes. Error: ' + err.message, 500);
//     }
// };