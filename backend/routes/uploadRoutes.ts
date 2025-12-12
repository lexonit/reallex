import express from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth';
import { uploadToCloudinary, isCloudinaryConfigured, missingCloudinaryEnv } from '../utils/cloudinary';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Backward-compatible mock signer (kept for local dev)
router.get('/sign', authenticate as any, (req, res) => {
  const { fileName } = req.query as any;
  res.json({
    uploadUrl: `https://mock-s3.amazonaws.com/uploads/${fileName}?signature=mock123`,
    publicUrl: `https://mock-s3.amazonaws.com/uploads/${fileName}`
  });
});

// Cloudinary direct upload (no strict auth for file uploads)
router.post('/cloudinary', upload.single('file'), async (req: any, res) => {
  try {
    if (!isCloudinaryConfigured) {
      return res.status(500).json({ message: 'Cloudinary is not configured on the server', missing: missingCloudinaryEnv });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Extract vendorId and propertyName from request body for dynamic folder structure
    const { vendorId, propertyName } = req.body;
    
    const result = await uploadToCloudinary(req.file.buffer, { 
      vendorId, 
      propertyName 
    });
    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Upload failed' });
  }
});

// Download proxy for documents
router.get('/download', async (req: any, res) => {
  try {
    const { url, filename } = req.query;
    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ message: 'Failed to fetch file' });
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const fileName = filename || 'document';
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    // Use Node.js streams
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Download failed' });
  }
});

export default router;