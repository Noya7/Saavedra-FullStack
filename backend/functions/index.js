const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Busboy = require('busboy');
const path = require('path');
const os = require('os');
const fs = require('fs');
const {v4} = require('uuid');
const Jimp = require('jimp');
const cors = require('cors')({ origin: true });

admin.initializeApp();

exports.processAndUploadImages = functions
.runWith({ memory: '1GB', timeoutSeconds: 300 })
.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        if (req.method !== 'POST') return res.status(405).end();
        try {
            const logMemoryUsage = (label) => {
                    const memoryUsage = process.memoryUsage();
                    console.log(`${label} - Memory Usage:`);
                    console.log(`RSS: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`);
                    console.log(`Heap Total: ${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`);
                    console.log(`Heap Used: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
                    console.log(`External: ${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`);
                    console.log('-------------------------');
            };
                logMemoryUsage('Start of Function');
            const busboy = Busboy({ headers: req.headers });
            const tmpdir = os.tmpdir();
            const fields = {};
            const uploads = [];
            busboy.on('field', (fieldname, val) => { fields[fieldname] = val });
            busboy.on('file', (fieldname, file, fileInfo) => {
                const { filename } = fileInfo;
                const filepath = path.join(tmpdir, filename);
                const writeStream = fs.createWriteStream(filepath);
                file.pipe(writeStream);
                uploads.push(new Promise((resolve, reject) => {
                    writeStream.on('finish', () => resolve({ filepath, fieldname }));
                    writeStream.on('error', reject);
                }));
            });
            busboy.on('finish', async () => {
                const fileObjects = await Promise.all(uploads);
                    logMemoryUsage('After File Upload');
                const bucket = admin.storage().bucket();
                const imageUrls = [];
                for (const { filepath } of fileObjects) {
                    try {
                        const imageFile = await Jimp.read(filepath);
                        imageFile.resize(1024, Jimp.AUTO).quality(80);
                            logMemoryUsage('After Image Processing');
                        const buffer = await imageFile.getBufferAsync(Jimp.MIME_JPEG);
                        const filename = `estate_pictures/${fields.estateId}/${v4()}.jpg`;
                        const file = bucket.file(filename);
                        await file.save(buffer, {
                            metadata: { contentType: Jimp.MIME_JPEG },
                            public: true,
                            validation: 'md5'
                        });
                        const url = `https://storage.googleapis.com/${bucket.name}/${filename}`;
                        imageUrls.push(url);
                            logMemoryUsage('After File Upload to Storage');
                        if (global.gc) global.gc();
                    } finally {
                        fs.unlinkSync(filepath);
                    }
                }
                res.status(200).json({ imageUrls });
                    logMemoryUsage('End of Function');
            });
            busboy.end(req.rawBody);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error: ' + err.message });
        };
    });
});