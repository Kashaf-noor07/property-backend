const multer = require("multer");
const { put } = require("@vercel/blob");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadToVercelBlob = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) return next();

    const uploadedFiles = [];
    for (const file of req.files) {
      const blob = await put(`properties/${Date.now()}-${file.originalname}`, file.buffer, {
        access: "public",
        contentType: file.mimetype,
      });
      uploadedFiles.push(blob.url);
    }

    req.uploadedImageUrls = uploadedFiles;
    next();
  } catch (err) {
    console.error("Vercel Blob upload failed:", err);
    res.status(500).json({ error: "Image upload failed" });
  }
};

module.exports = { upload, uploadToVercelBlob };
