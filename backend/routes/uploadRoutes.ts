import express from 'express';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/sign', authenticate as any, (req, res) => {
  const { fileName, fileType } = req.query;
  res.json({
    uploadUrl: `https://mock-s3.amazonaws.com/uploads/${fileName}?signature=mock123`,
    publicUrl: `https://mock-s3.amazonaws.com/uploads/${fileName}`
  });
});

export default router;