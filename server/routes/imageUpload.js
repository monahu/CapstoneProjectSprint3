// Image upload and processing route for Cloudinary
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();
const upload = multer(); // memory storage

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, filename, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename,
        resource_type: 'image',
        format: 'webp',
        overwrite: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// POST /api/upload-image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const { originalname, buffer } = req.file;
    const baseName = uuidv4();
    const folder = 'restjam-posts';

    // Generate all sizes - optimized for modern devices
    const sizes = [
      { name: '', width: 1200 }, // desktop
      { name: '_mobile', width: 390 }, // optimized for modern mobile screens
      { name: '_mobile@2x', width: 780 }, // optimized 2x for mobile retina
      { name: '_tablet', width: 800 },
    ];
    const urls = {};
    for (const size of sizes) {
      const filename = `${baseName}${size.name}`;
      const resized = await sharp(buffer)
        .resize(size.width)
        .webp({ quality: 90 })
        .toBuffer();
      const url = await uploadToCloudinary(resized, filename, folder);
      // Use explicit keys: desktop, mobile, mobile@2x, tablet
      const key = size.name === '' ? 'desktop' : size.name.replace(/^_/, '');
      urls[key] = url;
    }
    res.json({ success: true, urls });
  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

module.exports = router;
