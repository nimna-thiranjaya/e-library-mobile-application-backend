const multer = require("multer");

const multerUploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // limiting files size to 10 MB
  },
});

module.exports = {
  multerUploader,
};
