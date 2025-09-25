import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";


// Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      throw new Error("Local file path is required");
    }

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "food-order-shops" // Optional: organize files in folder
    });

    // Remove locally saved temporary file
    fs.unlinkSync(localFilePath);
    
    return response.secure_url; // Return the secure URL
  } catch (error) {
    // Remove locally saved temporary file if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    throw error;
  }
};

export default uploadOnCloudinary;
// const uploadOnCloudinary = async (file) => {
//   try {
//     cloudinary.config({
//       cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//       api_key: process.env.CLOUDINARY_API_KEY,
//       api_secret: process.env.CLOUDINARY_API_SECRET
//     });
//     const result = await cloudinary.uploader
//       .upload(file)
//     fs.unlinkSync(file)
//     return result.secure_url
//   } catch (error) {
//     fs.unlinkSync(file)
//     console.log(error)
//   }

// }

// export default uploadOnCloudinary
