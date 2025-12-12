import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
console.log('Cloudinary Config:', {
  CLOUDINARY_CLOUD_NAME: CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING',
  CLOUDINARY_API_KEY: CLOUDINARY_API_KEY ? 'SET' : 'MISSING',
  CLOUDINARY_API_SECRET: CLOUDINARY_API_SECRET ? 'SET' : 'MISSING',
});
if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
}

export const missingCloudinaryEnv = [
  CLOUDINARY_CLOUD_NAME ? null : 'CLOUDINARY_CLOUD_NAME',
  CLOUDINARY_API_KEY ? null : 'CLOUDINARY_API_KEY',
  CLOUDINARY_API_SECRET ? null : 'CLOUDINARY_API_SECRET',
].filter(Boolean) as string[];

export const isCloudinaryConfigured = missingCloudinaryEnv.length === 0;

export const uploadToCloudinary = async (
  buffer: Buffer, 
  options: { vendorId?: string; propertyName?: string; folder?: string } = {}
) => {
  if (!isCloudinaryConfigured) {
    throw new Error(`Cloudinary is not configured. Missing: ${missingCloudinaryEnv.join(', ')}`);
  }
  
  // Build dynamic folder path: properties/{vendorId}/{propertyName}
  let folderPath = options.folder || 'properties';
  if (options.vendorId) {
    folderPath = `properties/${options.vendorId}`;
    if (options.propertyName) {
      // Sanitize property name for folder (remove special chars, spaces to hyphens)
      const sanitized = options.propertyName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);
      folderPath = `${folderPath}/${sanitized}`;
    }
  }
  
  return await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folderPath, resource_type: 'auto' },
      (error, result) => {
        if (error || !result) return reject(error || new Error('Upload failed'));
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      }
    );
    stream.end(buffer);
  });
};
