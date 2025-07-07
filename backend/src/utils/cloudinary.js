import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINAR_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async function (
  localFilePath, folderName = "title-iq-user-avatars"
) {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: folderName,
      resource_type: "auto",
    });

    console.log(`File uploaded on cloudinary. File src ${response.url}`);
    // once a file is uploaded, we delete it from our server
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    console.log(`Deleted from cloudinary. Public Id: ${publicId}`);
    console.log(`Result: ${result.result}`);
  } catch (error) {
    console.log(`Error deleting from cloudinary : ${error}`);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
