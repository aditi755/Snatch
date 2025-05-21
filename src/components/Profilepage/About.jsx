"use client";
import React, { useState, useEffect, useCallback } from "react";
import Accordion from "./Accordion";
import Profilecustomfile from "./Profilecustomfile";
import QuestionCounter from "./QuestionCounter";
import Image from "next/image";
import { saveQuestionsToDB, fetchProfileData, removeQuestion } from "@/utils/postQuestions";

const About = () => {
  const [aboutQuestions, setAboutQuestions] = useState([{ question: "", answer: "", coverImage: null, coverImageName: null }]);
  const [audienceQuestions, setAudienceQuestions] = useState([{ question: "", answer: "", coverImage: null, coverImageName: null }]);
  const [brandQuestions, setBrandQuestions] = useState([{ question: "", answer: "", coverImage: null, coverImageName: null }]);

  const [unsavedChanges, setUnsavedChanges] = useState({
    about: new Set(),
    audience: new Set(),
    brand: new Set()
  });

  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { aboutQuestions, audienceQuestions, brandQuestions } = await fetchProfileData();

        const finalAbout = aboutQuestions.length > 0 ? aboutQuestions : [{ question: "", answer: "", coverImage: null, coverImageName: null }];
        const finalAudience = audienceQuestions.length > 0 ? audienceQuestions : [{ question: "", answer: "", coverImage: null, coverImageName: null }];
        const finalBrand = brandQuestions.length > 0 ? brandQuestions : [{ question: "", answer: "", coverImage: null, coverImageName: null }];

        setAboutQuestions(finalAbout);
        setAudienceQuestions(finalAudience);
        setBrandQuestions(finalBrand);

        // ✅ Open first accordion by default for "about"
        setOpenIndex(0);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const updateSectionState = (sectionKey, newState) => {
    if (sectionKey === "about") setAboutQuestions(newState);
    if (sectionKey === "audience") setAudienceQuestions(newState);
    if (sectionKey === "brand") setBrandQuestions(newState);
  };

  const toggleAccordion = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleQuestionChange = (e, index, sectionKey, defaultQuestion) => {
    const selectedQuestion = e.target.value?.trim() || defaultQuestion;
    const newQuestions = [...(sectionKey === "about" ? aboutQuestions : sectionKey === "audience" ? audienceQuestions : brandQuestions)];
    newQuestions[index].question = selectedQuestion;
    updateSectionState(sectionKey, newQuestions);

    setUnsavedChanges(prev => ({
      ...prev,
      [sectionKey]: new Set(prev[sectionKey]).add(index)
    }));
  };

  const handleAnswerChange = (e, index, sectionKey) => {
    const newQuestions = [...(sectionKey === "about" ? aboutQuestions : sectionKey === "audience" ? audienceQuestions : brandQuestions)];
    newQuestions[index].answer = e.target.value;
    updateSectionState(sectionKey, newQuestions);

    setUnsavedChanges(prev => ({
      ...prev,
      [sectionKey]: new Set(prev[sectionKey]).add(index)
    }));
  };

  const handleCoverChange = (imageData, index, sectionKey) => {
    const newQuestions = [...(sectionKey === "about" ? aboutQuestions : sectionKey === "audience" ? audienceQuestions : brandQuestions)];
    newQuestions[index].coverImage = imageData.url;
    newQuestions[index].coverImageName = imageData.name;
    updateSectionState(sectionKey, newQuestions);

    setUnsavedChanges(prev => ({
      ...prev,
      [sectionKey]: new Set(prev[sectionKey]).add(index)
    }));
  };

  const handleSaveChanges = async (index, sectionKey) => {
    try {
      const questions = sectionKey === "about" ? aboutQuestions :
                        sectionKey === "audience" ? audienceQuestions :
                        brandQuestions;

      await saveQuestionsToDB(sectionKey, [questions[index]]);

      setUnsavedChanges(prev => ({
        ...prev,
        [sectionKey]: new Set([...prev[sectionKey]].filter(i => i !== index))
      }));

      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Failed to save changes:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  const addQuestion = (sectionKey) => {
    const newQuestion = { question: "", answer: "", coverImage: null, coverImageName: null };
    const updatedQuestions = [...(sectionKey === "about" ? aboutQuestions : sectionKey === "audience" ? audienceQuestions : brandQuestions), newQuestion];
    updateSectionState(sectionKey, updatedQuestions);
  };

  const handleRemoveQuestion = (questionId, sectionKey) => {
    let updatedQuestions;
    if (sectionKey === "about") {
      updatedQuestions = aboutQuestions.filter((q) => q._id !== questionId);
      setAboutQuestions(updatedQuestions);
    } else if (sectionKey === "audience") {
      updatedQuestions = audienceQuestions.filter((q) => q._id !== questionId);
      setAudienceQuestions(updatedQuestions);
    } else {
      updatedQuestions = brandQuestions.filter((q) => q._id !== questionId);
      setBrandQuestions(updatedQuestions);
    }
  };

  const handleSelectQuestion = (question, index, sectionKey) => {
    const newQuestions = [...(sectionKey === "about" ? aboutQuestions : sectionKey === "audience" ? audienceQuestions : brandQuestions)];
    newQuestions[index].question = question || newQuestions[0]?.question || "";
    updateSectionState(sectionKey, newQuestions);
  };

  

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col gap-4">
      {/* Accordion 1 – About You */}
      <Accordion title="About You*" isOpen={openIndex === 0} onToggle={() => toggleAccordion(0)}>
        <div className="text-gray-600 w-full overflow-y-auto h-[270px]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {aboutQuestions.map((item, index) => (
            <div key={index} className="mb-4 p-2 rounded-md" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <QuestionCounter
                label={`Question ${index + 1}`}
                value={item.question}
                onQuestionChange={(e) => handleQuestionChange(e, index, "about", aboutQuestions)}
                onAnswerChange={(e) => handleAnswerChange(e, index, "about")}
                maxWords={75}
                name={`aboutQuestion_${index}`}
                answerValue={item.answer}
                type="about"
                selectedQuestion={item.question}
                onSelectQuestion={(question) => handleSelectQuestion(question, index, "about")}
              />

              <div className="flex items-center gap-4 mb-4">
                <Profilecustomfile
                  onFileChange={(uploadedUrl) => handleCoverChange(uploadedUrl, index, "about")}
                  placeholder="Choose a cover picture"
                  iconSrc="/assets/icons/onboarding/Upload.svg"
                  label="Cover Picture"
                  type="about"
                  currentQuestionIndex={index}
                  coverImage={item.coverImage}
                  coverImageName={item.coverImageName}
                  currentQuestion={item}
                />

                <button
                  onClick={() => handleSaveChanges(index, "about")}
                  className="bg-electric-blue text-white px-4 py-3 rounded-md text-sm mt-7 font-apfel-grotezk-regular"
                >
                  Save answer
                </button>
              </div>

              {index > 0 && (
  <button
    onClick={() => handleRemoveQuestion(item._id, "about")}
    className="flex items-center text-electric-blue text-sm mt-2"
  >
    <Image
      src="/assets/icons/settings/Cross.svg"
      width={16}
      height={16}
      alt="Remove icon"
      className="mr-2" // Added more space between image and text
    />
    Remove question
  </button>
)}

            </div>
          ))}

          <div className="flex -mt-4 cursor-pointer" onClick={() => addQuestion("about")}>
            <Image src="/assets/images/plus.svg" width={25} height={25} alt="plus icon" className="mr-1" />
            <p className="font-qimano text-graphite">Add a new question</p>
            <div className="flex-1 ml-2 mt-3.5 border-t border-gray-200"></div>
          </div>
        </div>
      </Accordion>

      {/* Accordion 2 – About Audience */}
      <Accordion title="About Audience*" isOpen={openIndex === 1} onToggle={() => toggleAccordion(1)}>
        <div className="text-gray-600 w-full overflow-y-auto h-[270px]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {audienceQuestions.map((item, index) => (
            <div key={index} className="mb-4 p-2 rounded-md">
              <QuestionCounter
                label={`Question ${index + 1}`}
                value={item.question}
                onQuestionChange={(e) => handleQuestionChange(e, index, "audience", audienceQuestions)}
                onAnswerChange={(e) => handleAnswerChange(e, index, "audience")}
                maxWords={75}
                name={`audienceQuestion_${index}`}
                answerValue={item.answer}
                type="audience"
                selectedQuestion={item.question}
                onSelectQuestion={(question) => handleSelectQuestion(question, index, "audience")}
              />

              <div className="flex items-center gap-4 mb-4">
                <Profilecustomfile
                  onFileChange={(uploadedUrl) => handleCoverChange(uploadedUrl, index, "audience")}
                  placeholder="Choose a cover picture"
                  iconSrc="/assets/icons/onboarding/Upload.svg"
                  label="Cover Picture"
                  type="audience"
                  currentQuestionIndex={index}
                  currentQuestion={item}
                />

                <button
                  onClick={() => handleSaveChanges(index, "audience")}
                  className="bg-electric-blue text-white px-4 py-3 rounded-md text-sm mt-7 font-apfel-grotezk-regular"
                >
                  Save answer
                </button>
              </div>

              {index > 0 && (
  <button
    onClick={() => handleRemoveQuestion(item._id, "audience")}
    className="flex items-center text-electric-blue text-sm mt-2"
  >
    <Image
      src="/assets/icons/settings/Cross.svg"
      width={16}
      height={16}
      alt="Remove icon"
      className="mr-2" // Added more space between image and text
    />
    Remove question
  </button>
)}

            </div>
          ))}

          <div className="flex -mt-4 cursor-pointer" onClick={() => addQuestion("audience")}>
            <Image src="/assets/images/plus.svg" width={25} height={25} alt="plus icon" className="mr-1" />
            <p className="font-qimano text-graphite">Add a new question</p>
            <div className="flex-1 ml-2 mt-3.5 border-t border-gray-200"></div>
          </div>
        </div>
      </Accordion>

      {/* Accordion 3 – Brand Connection */}
      <Accordion title="Brand Connection*" isOpen={openIndex === 2} onToggle={() => toggleAccordion(2)}>
        <div className="text-gray-600 w-full overflow-y-auto h-[270px]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {brandQuestions.map((item, index) => (
            <div key={index} className="mb-4 p-2 rounded-md">
              <QuestionCounter
                label={`Question ${index + 1}`}
                value={item.question}
                onQuestionChange={(e) => handleQuestionChange(e, index, "brand", brandQuestions)}
                onAnswerChange={(e) => handleAnswerChange(e, index, "brand")}
                maxWords={75}
                name={`brandQuestion_${index}`}
                answerValue={item.answer}
                type="brand"
                selectedQuestion={item.question}
                onSelectQuestion={(question) => handleSelectQuestion(question, index, "brand")}
              />

              <div className="flex items-center gap-4 mb-4">
                <Profilecustomfile
                  onFileChange={(uploadedUrl) => handleCoverChange(uploadedUrl, index, "brand")}
                  placeholder="Choose a cover picture"
                  iconSrc="/assets/icons/onboarding/Upload.svg"
                  label="Cover Picture"
                  type="brand"
                  currentQuestionIndex={index}
                  currentQuestion={item}
                />

                <button
                  onClick={() => handleSaveChanges(index, "brand")}
                  className="bg-electric-blue text-white px-4 py-3 rounded-md text-sm mt-7 font-apfel-grotezk-regular"
                >
                  Save answer
                </button>
              </div>

              {index > 0 && (
  <button
    onClick={() => handleRemoveQuestion(item._id, "brand")}
    className="flex items-center text-electric-blue text-sm mt-2"
  >
    <Image
      src="/assets/icons/settings/cross.svg"
      width={16}
      height={16}
      alt="Remove icon"
      className="mr-2" // Added more space between image and text
    />
    Remove question
  </button>
)}

            </div>
          ))}

          <div className="flex -mt-4 cursor-pointer" onClick={() => addQuestion("brand")}>
            <Image src="/assets/images/plus.svg" width={25} height={25} alt="plus icon" className="mr-1" />
            <p className="font-qimano text-graphite">Add a new question</p>
            <div className="flex-1 ml-2 mt-3.5 border-t border-gray-200"></div>
          </div>
        </div>
      </Accordion>
    </div>
  );
};

export default About;