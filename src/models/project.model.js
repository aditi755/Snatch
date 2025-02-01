

import mongoose from "mongoose";

// Define the subschema for children
const instagramChildSchema = new mongoose.Schema({
  id: { type: String, required: true },
  media_type: {type: String},
  media_url: {type: String},
});

// Define the subschema for instagramSelected
const instagramSelectedSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  mediaId: { type: String, required: true },
  mediaLink: { type: String, required: true },
  children: { type: [instagramChildSchema], default: [] }, // Array of children
  isDraft: { type: Boolean, default: true }, // Individual draft flag
});

  const formDataValueSchema = new mongoose.Schema({
  key: { type: String, required: true }, 
  eventName: { type: String, default: "" },
  eventLocation: { type: String, default: "" },
  eventYear: { type: String, default: "" },
  companyName: { type: String, default: "" },
  companyLocation: { type: String, default: "" },
  companyLogo: { type: String, default: "" },
  companyLogoFileName: { type: String, default: "" },
  description: { type: String, default: "" },
  eventTypes: { type: [String], default: [] }, // Array of strings
  industries: { type: [String], default: [] }, // Array of strings
  titleName: { type: String, default: "" },
  isDraft: { type: Boolean, default: true }, // Individual draft flag
});

const uploadedFilesSchema = new mongoose.Schema({
  mediaId : { type:Number, required: true },
  fileName: {type: String, required: true},
  fileUrl: {type: String, required: true},
  isDraft: { type: Boolean, default: true }, // Individual draft flag
})


// Define the main schema
const projectDraftSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  uploadedFiles: { type: [uploadedFilesSchema], default: [] },
  instagramSelected: { type: [instagramSelectedSchema], default: [] }, 
  formData: { type: [formDataValueSchema], default: [] },
  //isDraft: { type: Boolean, default: true }, 
  updatedAt: { type: Date, default: Date.now },
});


const ProjectDraft =  mongoose?.models?.ProjectDraft || mongoose.model("ProjectDraft", projectDraftSchema);

console.log("Available models:", mongoose.models);
export default ProjectDraft;

