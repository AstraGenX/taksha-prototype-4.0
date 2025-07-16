const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Upload single image
router.post('/image', authenticate, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const { folder = 'products', quality = 80, width, height } = req.body;
    
    // Process image with sharp
    let imageBuffer = req.file.buffer;
    const sharpImage = sharp(imageBuffer);
    
    // Resize if dimensions provided
    if (width && height) {
      sharpImage.resize(parseInt(width), parseInt(height), { fit: 'cover' });
    }
    
    // Compress image
    if (req.file.mimetype === 'image/jpeg') {
      sharpImage.jpeg({ quality: parseInt(quality) });
    } else if (req.file.mimetype === 'image/png') {
      sharpImage.png({ quality: parseInt(quality) });
    } else if (req.file.mimetype === 'image/webp') {
      sharpImage.webp({ quality: parseInt(quality) });
    }
    
    imageBuffer = await sharpImage.toBuffer();
    
    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `taksha/${folder}`,
          resource_type: 'image',
          transformation: [
            { quality: 'auto', fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(imageBuffer);
    });
    
    res.json({
      message: 'Image uploaded successfully',
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      dimensions: {
        width: uploadResult.width,
        height: uploadResult.height
      },
      format: uploadResult.format,
      size: uploadResult.bytes
    });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ message: 'Server error while uploading image' });
  }
});

// Upload multiple images
router.post('/images', authenticate, requireAdmin, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    
    const { folder = 'products', quality = 80, width, height } = req.body;
    
    const uploadPromises = req.files.map(async (file) => {
      // Process image with sharp
      let imageBuffer = file.buffer;
      const sharpImage = sharp(imageBuffer);
      
      // Resize if dimensions provided
      if (width && height) {
        sharpImage.resize(parseInt(width), parseInt(height), { fit: 'cover' });
      }
      
      // Compress image
      if (file.mimetype === 'image/jpeg') {
        sharpImage.jpeg({ quality: parseInt(quality) });
      } else if (file.mimetype === 'image/png') {
        sharpImage.png({ quality: parseInt(quality) });
      } else if (file.mimetype === 'image/webp') {
        sharpImage.webp({ quality: parseInt(quality) });
      }
      
      imageBuffer = await sharpImage.toBuffer();
      
      // Upload to Cloudinary
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: `taksha/${folder}`,
            resource_type: 'image',
            transformation: [
              { quality: 'auto', fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve({
              url: result.secure_url,
              publicId: result.public_id,
              dimensions: {
                width: result.width,
                height: result.height
              },
              format: result.format,
              size: result.bytes
            });
          }
        ).end(imageBuffer);
      });
    });
    
    const uploadResults = await Promise.all(uploadPromises);
    
    res.json({
      message: 'Images uploaded successfully',
      images: uploadResults
    });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({ message: 'Server error while uploading images' });
  }
});

// Delete image
router.delete('/image/:publicId', authenticate, requireAdmin, async (req, res) => {
  try {
    const { publicId } = req.params;
    
    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      res.json({ message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ message: 'Server error while deleting image' });
  }
});

// Get image details
router.get('/image/:publicId', authenticate, requireAdmin, async (req, res) => {
  try {
    const { publicId } = req.params;
    
    const result = await cloudinary.api.resource(publicId);
    
    res.json({
      publicId: result.public_id,
      url: result.secure_url,
      dimensions: {
        width: result.width,
        height: result.height
      },
      format: result.format,
      size: result.bytes,
      createdAt: result.created_at
    });
  } catch (error) {
    console.error('Get image details error:', error);
    if (error.http_code === 404) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.status(500).json({ message: 'Server error while fetching image details' });
  }
});

// List images in folder
router.get('/images/:folder', authenticate, requireAdmin, async (req, res) => {
  try {
    const { folder } = req.params;
    const { limit = 50, next_cursor } = req.query;
    
    const options = {
      type: 'upload',
      prefix: `taksha/${folder}/`,
      max_results: parseInt(limit)
    };
    
    if (next_cursor) {
      options.next_cursor = next_cursor;
    }
    
    const result = await cloudinary.api.resources(options);
    
    const images = result.resources.map(resource => ({
      publicId: resource.public_id,
      url: resource.secure_url,
      dimensions: {
        width: resource.width,
        height: resource.height
      },
      format: resource.format,
      size: resource.bytes,
      createdAt: resource.created_at
    }));
    
    res.json({
      images,
      nextCursor: result.next_cursor,
      hasMore: !!result.next_cursor
    });
  } catch (error) {
    console.error('List images error:', error);
    res.status(500).json({ message: 'Server error while listing images' });
  }
});

// Generate image transformations
router.post('/transform', authenticate, requireAdmin, async (req, res) => {
  try {
    const { publicId, transformations } = req.body;
    
    if (!publicId || !transformations) {
      return res.status(400).json({ message: 'Public ID and transformations are required' });
    }
    
    // Generate transformed URLs
    const transformedUrls = transformations.map(transformation => {
      return cloudinary.url(publicId, transformation);
    });
    
    res.json({
      message: 'Image transformations generated',
      originalUrl: cloudinary.url(publicId),
      transformedUrls
    });
  } catch (error) {
    console.error('Transform image error:', error);
    res.status(500).json({ message: 'Server error while transforming image' });
  }
});

// Get upload signature for direct client uploads
router.post('/signature', authenticate, requireAdmin, async (req, res) => {
  try {
    const { folder = 'products', timestamp } = req.body;
    
    const params = {
      timestamp: timestamp || Math.round(new Date().getTime() / 1000),
      folder: `taksha/${folder}`
    };
    
    const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);
    
    res.json({
      signature,
      timestamp: params.timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder: params.folder
    });
  } catch (error) {
    console.error('Generate signature error:', error);
    res.status(500).json({ message: 'Server error while generating signature' });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Maximum 10MB allowed.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files. Maximum 10 files allowed.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Unexpected file field.' });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({ message: error.message });
  }
  
  next(error);
});

module.exports = router;