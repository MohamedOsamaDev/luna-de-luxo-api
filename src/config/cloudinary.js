import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
const accounts = [
  {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME_1,
    api_key: process.env.CLOUDINARY_API_KEY_1,
    api_secret: process.env.CLOUDINARY_API_SECRET_1,
  },
  {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME_2,
    api_key: process.env.CLOUDINARY_API_KEY_2,
    api_secret: process.env.CLOUDINARY_API_SECRET_2,
  },
];

const configureCloudinary = (accountKey) => {
  const account = accounts[accountKey];
  if (account) {
    cloudinary.config(account);
  }
};
// For handling file uploads
export const Uploader = async (path, accountKey) => {
  configureCloudinary(accountKey); // Set the Cloudinary configuration
  const result = await cloudinary.uploader.upload(path);
  return { url: result.secure_url, public_id: result.public_id };
};
// For handling file deletions
export const deleteFileCloudinary = async (public_id, accountKey) => {
  configureCloudinary(accountKey); // Set the Cloudinary configuration
  const result = await cloudinary.uploader.destroy(public_id);
  return result;
};

export { cloudinary };
