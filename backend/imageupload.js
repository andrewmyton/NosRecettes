import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config() // Load environment variables from .env file

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const image = '/workspaces/NosRecettes/backend/images/Apple.jpg'

cloudinary.uploader.upload(image).then((result) => {
  console.log(result.url)
})

// const uploadImage = async (imagePath) => {
//   try {
//     const result = await cloudinary.uploader.upload(imagePath, {
//       use_filename: true,
//       unique_filename: false,
//       overwrite: true,
//     });
//     console.log('Upload successful:', result);
//     return result;
//   } catch (error) {
//     console.error('Upload failed:', error);
//     throw error;
//   }
// };
