import React, { useState } from "react";
import { addQuestionToDB } from "@/api/apiJobs";

const CustomQuestions = ({ token }) => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState(null);

  const addQuestion = async () => {
    if (!newQuestion.trim() || correctOption === null || newOptions.some((opt) => !opt.trim())) {
      alert("Please fill out the question, options, and select a correct option.");
      return;
    }

    const questionData = {
      question: newQuestion,
      option1: newOptions[0],
      option2: newOptions[1],
      option3: newOptions[2],
      option4: newOptions[3],
      ans: correctOption + 1, // Save the correct option as a 1-based index
      job_id: 1, // Replace with the actual job_id if dynamic
    };

    try {
      console.log("Sending question data to API:", questionData); // Debugging log
      const savedQuestion = await addQuestionToDB(token, questionData); // Save the question
      console.log("Question saved successfully:", savedQuestion);

      // Update the local state with the newly saved question
      setQuestions([
        ...questions,
        {
          id: savedQuestion[0].id, // Use the ID returned by Supabase
          question: savedQuestion[0].question,
          options: newOptions,
          correctOption,
        },
      ]);

      // Clear the form fields
      setNewQuestion("");
      setNewOptions(["", "", "", ""]);
      setCorrectOption(null);
    } catch (error) {
      console.error("Error Saving Question:", error.message);
      alert("Error Saving Question: " + error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-900 text-white">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage MCQ Questions</h1>
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
          type="button"
          onClick={addQuestion}
          className="bg-blue-600 px-6 py-2 rounded-lg text-white hover:bg-blue-700"
        >
          Add Question
        </button>
      </div>
    </div>
  );
};

export default CustomQuestions;