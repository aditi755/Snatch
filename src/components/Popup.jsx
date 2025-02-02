import React from "react";

function Popup({ onClose, onContinueEditing, onNextStep }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-black">
        <p className="text-lg text-black font-qimano">Disclaimer</p>

        <div className="border-b border-3 border-gray-300 mt-3"></div>
        <p className="text-md font-apfel-grotezk-regular mt-3">Are you sure you want to save this project?  Incomplete projects will be saved as drafts</p>

        <div className="flex justify-center gap-5 mt-8 font-apfel-grotezk-regular">
          <button onClick={onContinueEditing} className="mr-2 bg-white border-2 border-electric-blue text-electric-blue px-10 py-2 rounded-md">Continue Editing</button>
          <button onClick={onNextStep} className="bg-electric-blue text-white px-10 py-2 rounded-md">Save Project</button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
