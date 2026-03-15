// ===== NEW FILE CREATED FOR AVATAR UPLOAD FEATURE =====
const multer = require('multer');

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIMES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận ảnh: JPEG, PNG, WebP. Tối đa 2MB.'), false);
  }
};

const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE }
}).single('avatar');

/**
 * Wrapper để trả lỗi multer/validation dạng JSON
 */
const uploadAvatarMiddleware = (req, res, next) => {
  uploadAvatar(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'Kích thước ảnh tối đa 2MB' });
        }
        return res.status(400).json({ message: err.message });
      }
      return res.status(400).json({ message: err.message || 'Upload thất bại' });
    }
    next();
  });
};

module.exports = {
  uploadAvatarMiddleware
};
