const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

// Configuración del cliente S3
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// 🔁 Subir imagen
async function uploadImage(filePath, roomId, imageNumber) {
    const fileContent = fs.readFileSync(filePath);
    const extension = path.extname(filePath); // .jpg, .png...
    const fileName = `rooms/room_${roomId}/img_${imageNumber}${extension}`;

    const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
        Body: fileContent,
        ContentType: `image/${extension.replace('.', '')}`,
    });

    await s3.send(command);
    console.log(`✅ Uploaded ${fileName}`);
}

// 🧪 Ejemplo de uso
(async () => {
    const roomId = 5;
    const files = ['img_15.jpg', 'img_16.jpg', 'img_17.jpg', 'img_18.jpg']; // Rutas relativas

    for (let i = 0; i < files.length; i++) {
        await uploadImage(path.join(__dirname, files[i]), roomId, i + 1);
    }

    console.log('🎉 Todas las imágenes han sido subidas.');
})();