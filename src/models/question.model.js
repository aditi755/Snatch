import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: String,
  answer: String,
  image: String
});

const questionnaireSchema = new mongoose.Schema({
  userId : {
    type: String,
  },
  section: {
    type: String,
    enum: ['audience', 'brand', 'about']
  },
  questions: [questionSchema]
});

const Questionnaire = mongoose.models.Questionnaire || mongoose.model("Questionnaire", questionnaireSchema);
export default Questionnaire;
