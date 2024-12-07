const API_URL = "https://zany-fortnight-g47x79x697jj3974q-3000.app.github.dev/";

// Fetch and display questions
async function fetchQuestions() {
  const response = await fetch('https://zany-fortnight-g47x79x697jj3974q-3000.app.github.dev/');
  const questions = await response.json();
  displayQuestions(questions);
  fetch("/api/questions")
  .then((res) => res.json())
  .then((data) => {
      const questionsList = document.getElementById("questionsList");
      questionsList.innerHTML = ""; // Clear the list

      data.forEach((q, index) => {
          const questionItem = document.createElement("li");
          questionItem.textContent = `${index + 1}. ${q.question} (Options: ${q.options.join(", ")})`;
          questionsList.appendChild(questionItem);
      });
  })
  .catch((err) => {
      console.error("Error fetching questions:", err);
  });
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
    await fetch(`${'https://zany-fortnight-g47x79x697jj3974q-3000.app.github.dev/'}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(question),
    });
  } else {
    // Add new question
    await fetch('https://zany-fortnight-g47x79x697jj3974q-3000.app.github.dev/', {
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
  const response = await fetch(`${'https://zany-fortnight-g47x79x697jj3974q-3000.app.github.dev/'}/${id}`);
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
  await fetch(`${'https://zany-fortnight-g47x79x697jj3974q-3000.app.github.dev/'}/${id}`, { method: "DELETE" });
  fetchQuestions();
}
document.getElementById("addQuestionForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const question = document.getElementById("questionInput").value;
  const options = [
      document.getElementById("option1Input").value,
      document.getElementById("option2Input").value,
      document.getElementById("option3Input").value,
      document.getElementById("option4Input").value,
  ];
  const answer = parseInt(document.getElementById("answerInput").value) - 1;

  const newQuestion = { question, options, answer };

  fetch("/api/questions", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuestion),
  })
      .then((res) => res.json())
      .then((data) => {
          alert(data.message); // Show success message
          fetchQuestions(); // Refresh the list
      })
      .catch((err) => {
          console.error("Error adding question:", err);
      });
});

// Initialize app
fetchQuestions();
