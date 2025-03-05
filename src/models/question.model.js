// import mongoose from "mongoose";

// const questionSchema = new mongoose.Schema({
//   question: String,
//   answer: String,
//   image: String
// });

// const questionnaireSchema = new mongoose.Schema({
//   userId : {
//     type: String,
//   },
//   section: {
//     type: String,
//     enum: ['audience', 'brand', 'about']
//   },
//   questions: [questionSchema]
// });

// const Questionnaire = mongoose.models.Questionnaire || mongoose.model("Questionnaire", questionnaireSchema);
// export default Questionnaire;


import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: String,
  answer: String,
  coverImage: String, 
  coverImageName: String,
});

const sectionSchema = new mongoose.Schema({
  section: {
    type: String,
    enum: ["audience", "brand", "about"],
    required: true,
  },
  questions: [questionSchema], // Array of questions
});

const questionnaireSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  sections: [sectionSchema], // Array of sections
});

const Questionnaire =
  mongoose.models.Questionnaire || mongoose.model("Questionnaire", questionnaireSchema);

export default Questionnaire;