//utils/cloudinaryUpload.js
import axios from "axios";

const cloudinaryUpload = async (file) => {
  const formData = new FormData();
  console.log("file cloudinary", file)
  formData.append("file", file);
  formData.append("upload_preset", "snatch"); // Replace with your Cloudinary upload preset
  formData.append("cloud_name", "dgk9ok5fx"); // Replace with your Cloudinary cloud name

  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dgk9ok5fx/upload",  //general endpoint for cloudinart /image for image only upload
      formData
    );
    return response.data.secure_url; // Return the uploaded image URL
  } catch (error) {
    console.error("Cloudinary upload error:", error, error.response ? error.response.data : error.message);
    throw error;
  }
};

export default cloudinaryUpload;
