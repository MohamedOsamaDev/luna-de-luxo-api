import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config(); //config env
cloudinary.config({
  // configuration for cloudinary
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
// for handle upload files
export const Uploader = async (path) => {
  const result = await cloudinary.uploader.upload(path);
  return { url: result.secure_url, public_id: result.public_id };
};
// for handle files in cloud and update files  (overwrite existing files)
export const updateFileCloudinary = async (path, public_id) => {
  const result = await cloudinary.uploader.upload(path, {
    public_id,
  });
  return { url: result.secure_url, public_id: result.public_id };
};
// for hendle delete files in cloud
export const deleteFileCloudinary = async (public_id) => {
  const result = cloudinary.uploader.destroy(public_id);
  return result;
};

export { cloudinary };
