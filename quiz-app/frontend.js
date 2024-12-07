const API_URL = "/api/questions";

// Fetch and display questions
async function fetchQuestions() {
  const response = await fetch(API_URL);
  const questions = await response.json();
  displayQuestions(questions);
}

// Display questions in the table
function displayQuestions(questions) {
  const table = document.getElementById("questions-table");
  table.innerHTML = ""; // Clear previous rows
  questions.forEach((question) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${question.text}</td>
      <td>${question.answers.join(", ")}</td>
      <td>
        <button onclick="editQuestion(${question.id})">Edit</button>
        <button onclick="deleteQuestion(${question.id})">Delete</button>
      </td>
    `;
    table.appendChild(row);
  });
}

// Handle form submission
document.getElementById("question-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = document.getElementById("question-id").value;
  const text = document.getElementById("question-text").value;
  const answers = [
    document.getElementById("answer1").value,
    document.getElementById("answer2").value,
    document.getElementById("answer3").value,
    document.getElementById("answer4").value,
  ];
  const correctAnswer = parseInt(document.getElementById("correct-answer").value);

  const question = { text, answers, correctAnswer };

  if (id) {
    // Update question
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(question),
    });
  } else {
    // Add new question
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(question),
    });
  }

  document.getElementById("question-form").reset();
  fetchQuestions();
});

// Edit question
async function editQuestion(id) {
  const response = await fetch(`${API_URL}/${id}`);
  const question = await response.json();
  document.getElementById("question-id").value = question.id;
  document.getElementById("question-text").value = question.text;
  document.getElementById("answer1").value = question.answers[0];
  document.getElementById("answer2").value = question.answers[1];
  document.getElementById("answer3").value = question.answers[2];
  document.getElementById("answer4").value = question.answers[3];
  document.getElementById("correct-answer").value = question.correctAnswer;
}

// Delete question
async function deleteQuestion(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchQuestions();
}

// Initialize app
fetchQuestions();
