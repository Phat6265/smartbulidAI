// ===== NEW FILE CREATED FOR AVATAR UPLOAD FEATURE =====
const { Readable } = require('stream');
const cloudinary = require('cloudinary').v2;

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.warn(
    '[cloudinary] CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY hoặc CLOUDINARY_API_SECRET chưa được cấu hình.'
  );
}

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true
});

/**
 * Upload buffer (từ multer memory) lên Cloudinary
 * @param {Buffer} buffer - File buffer
 * @param {string} [folder='avatars'] - Folder trên Cloudinary
 * @returns {Promise<{ secure_url: string }>}
 */
async function uploadFromBuffer(buffer, folder = 'avatars') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
      },
      (err, result) => {
        if (err) return reject(err);
        if (!result || !result.secure_url) {
          return reject(new Error('Upload failed: no secure_url'));
        }
        resolve({ secure_url: result.secure_url });
      }
    );
    const readStream = Readable.from(buffer);
    readStream.pipe(uploadStream);
  });
}

module.exports = {
  cloudinary,
  uploadFromBuffer
};
