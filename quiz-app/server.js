const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Serve static files from the public folder

// Load questions from file
let questions = [];
const loadQuestions = () => {
  try {
    questions = JSON.parse(fs.readFileSync("./questions.json", "utf-8"));
  } catch (error) {
    questions = [];
  }
};
loadQuestions();

// Save questions to file
const saveQuestions = () => {
  fs.writeFileSync("./questions.json", JSON.stringify(questions, null, 2));
};

// API Endpoints
// Get all questions
app.get("/api/questions", (req, res) => {
  res.json(questions);
});

// Add a new question
app.post("/api/questions", (req, res) => {
  const newQuestion = {
    id: Date.now(),
    text: req.body.text,
    answers: req.body.answers,
    correctAnswer: req.body.correctAnswer,
  };
  questions.push(newQuestion);
  saveQuestions();
  res.status(201).json(newQuestion);
});

// Update a question
app.put("/api/questions/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = questions.findIndex((q) => q.id === id);
  if (index !== -1) {
    questions[index] = { id, ...req.body };
    saveQuestions();
    res.json(questions[index]);
  } else {
    res.status(404).send("Question not found");
  }
});

// Delete a question
app.delete("/api/questions/:id", (req, res) => {
  const id = parseInt(req.params.id);
  questions = questions.filter((q) => q.id !== id);
  saveQuestions();
  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
