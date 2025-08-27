"use client";
import React, { useState } from "react";
import { marked } from "marked";

const FlashcardGenerator = () => {
  const [subject, setSubject] = useState("");
  const [examType, setExamType] = useState("flashcards");
  const [focusArea, setFocusArea] = useState("");
  const [numCards, setNumCards] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [markdown, setMarkdown] = useState("");

  const generateCards = async () => {
    setLoading(true);
    setError(null);
    setMarkdown("");

    const content = `Please make flashcards for a ${subject} exam with a focus area of ${focusArea}. Make ${numCards} cards. Exam type: ${examType}.`;

    const requestData = {
      messages: [
        {
          role: "system",
          content:
            "You are a teacher or tutor helping someone prepare for an exam. Always output flashcards as a Markdown table.",
        },
        { role: "user", content },
      ],
      model: "gpt-oss:120b",
      stream: false,
    };

    try {
      const response = await fetch("https://ollama.utahtech.dev/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) throw new Error("Failed to generate flashcards");

      const data = await response.json();
      setMarkdown(data.message.content);
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col md:flex-row gap-6 items-stretch p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Generate Flashcards
        </h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-300 transition"
              placeholder="e.g. Human Anatomy"
            />
          </div>

          <div>
            <label
              htmlFor="exam-type"
              className="block text-sm font-medium text-gray-700"
            >
              Exam Type
            </label>
            <select
              id="exam-type"
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-300 transition"
            >
              <option value="flashcards">Flashcards</option>
              <option value="multiple-choice">Multiple Choice</option>
              <option value="true-false">True/False</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="focus-area"
              className="block text-sm font-medium text-gray-700"
            >
              Focus Area
            </label>
            <input
              type="text"
              id="focus-area"
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-300 transition"
              placeholder="e.g. Muscular System"
            />
          </div>

          <div>
            <label
              htmlFor="num-cards"
              className="block text-sm font-medium text-gray-700"
            >
              Number of Cards
            </label>
            <input
              type="number"
              id="num-cards"
              value={numCards}
              onChange={(e) => setNumCards(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-300 transition"
              min="1"
            />
          </div>

          <button
            type="button"
            onClick={generateCards}
            disabled={loading}
            className="w-full py-2 px-4 mt-4 bg-indigo-600 text-white rounded-md shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition"
          >
            {loading ? "Generating..." : "Generate Flashcards"}
          </button>

          {error && (
            <div className="text-red-500 text-sm mt-2 text-center">{error}</div>
          )}
        </div>
      </div>

      <div className="flex-1 bg-white p-6 rounded-lg shadow-lg overflow-auto">
        {markdown ? (
          <div className="prose max-w-none">
            <h3 className="font-semibold mb-4 text-xl border-b pb-2">
              Generated Flashcards:
            </h3>
            <div className="overflow-x-auto">
              <div
                className="markdown-body"
                dangerouslySetInnerHTML={{ __html: marked(markdown) }}
              />
            </div>
          </div>
        ) : (
          <p className="text-gray-500">
            Flashcards will appear here after generation.
          </p>
        )}
      </div>
    </div>
  );
};

export default FlashcardGenerator;
