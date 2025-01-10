// Import required modules
import React, { useState } from "react";

const RecruiterMCQsPage = () => {
  const [questions, setQuestions] = useState([
    { id: 1, question: "Sample Question 1", options: ["Option A", "Option B", "Option C", "Option D"], correctOption: 0 },
    { id: 2, question: "Sample Question 2", options: ["Option A", "Option B", "Option C", "Option D"], correctOption: 2 },
  ]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState(null);

  // Add a new MCQ question
  const addQuestion = () => {
    if (!newQuestion.trim() || correctOption === null || newOptions.some(opt => !opt.trim())) {
      alert("Please fill out the question, options, and select a correct option.");
      return;
    }

    const newQuestionObj = {
      id: questions.length + 1,
      question: newQuestion,
      options: newOptions,
      correctOption,
    };

    setQuestions([...questions, newQuestionObj]);
    setNewQuestion("");
    setNewOptions(["", "", "", ""]);
    setCorrectOption(null);
  };

  // Remove a question
  const removeQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-900 text-white">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage MCQ Questions</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add New Job
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {questions.map((question) => (
          <div
            key={question.id}
            className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="font-semibold text-lg mb-2">{question.question}</h2>
            <ul className="list-disc list-inside space-y-1">
              {question.options.map((option, index) => (
                <li
                  key={index}
                  className={`${
                    question.correctOption === index ? "text-green-400 font-bold" : ""
                  }`}
                >
                  {option}
                </li>
              ))}
            </ul>
            <button
              onClick={() => removeQuestion(question.id)}
              className="text-red-500 mt-4 hover:underline"
            >
              Remove Question
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Add a New MCQ Question</h2>
        <textarea
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Enter your MCQ question"
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 mb-4 placeholder-gray-400"
        ></textarea>

        {newOptions.map((option, index) => (
          <div key={index} className="mb-3 flex items-center gap-4">
            <input
              type="text"
              value={option}
              onChange={(e) => {
                const updatedOptions = [...newOptions];
                updatedOptions[index] = e.target.value;
                setNewOptions(updatedOptions);
              }}
              placeholder={`Option ${index + 1}`}
              className="flex-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 placeholder-gray-400"
            />
            <input
              type="radio"
              name="correctOption"
              checked={correctOption === index}
              onChange={() => setCorrectOption(index)}
              className="form-radio text-blue-500"
            />
          </div>
        ))}

        <button
          onClick={addQuestion}
          className="bg-blue-600 px-6 py-2 rounded-lg text-white hover:bg-blue-700"
        >
          Add Question
        </button>
      </div>
    </div>
  );
};

export default RecruiterMCQsPage;
