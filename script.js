let quizzes = [];
let users = [];
let currentUser = null;

function showSection(sectionId) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => section.classList.add('hidden'));

  document.getElementById(sectionId).classList.remove('hidden');

  if (sectionId === 'quiz-list') {
    loadQuizzes();
  }
}

function addQuestion() {
  const questionContainer = document.getElementById('questions-container');
  const questionNumber = questionContainer.children.length + 1;
  const questionDiv = document.createElement('div');
  questionDiv.className = 'question-container';

  questionDiv.innerHTML = `
    <label for="question-${questionNumber}">Question ${questionNumber}:</label>
    <input type="text" id="question-${questionNumber}" name="question-${questionNumber}" required>
    <div class="options-container">
      <label for="option-${questionNumber}-1">Option 1:</label>
      <input type="text" id="option-${questionNumber}-1" name="option-${questionNumber}-1" required>
      <label for="option-${questionNumber}-2">Option 2:</label>
      <input type="text" id="option-${questionNumber}-2" name="option-${questionNumber}-2" required>
      <label for="option-${questionNumber}-3">Option 3:</label>
      <input type="text" id="option-${questionNumber}-3" name="option-${questionNumber}-3" required>
      <label for="option-${questionNumber}-4">Option 4:</label>
      <input type="text" id="option-${questionNumber}-4" name="option-${questionNumber}-4" required>
      <label for="correct-option-${questionNumber}">Correct Option (1-4):</label>
      <input type="number" id="correct-option-${questionNumber}" name="correct-option-${questionNumber}" min="1" max="4" required>
    </div>
  `;

  questionContainer.appendChild(questionDiv);
}

document.getElementById('quiz-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const quizTitle = document.getElementById('quiz-title').value;
  const questions = [];
  document.querySelectorAll('.question-container').forEach((container, index) => {
    const questionText = container.querySelector(`#question-${index + 1}`).value;
    const options = [
      container.querySelector(`#option-${index + 1}-1`).value,
      container.querySelector(`#option-${index + 1}-2`).value,
      container.querySelector(`#option-${index + 1}-3`).value,
      container.querySelector(`#option-${index + 1}-4`).value,
    ];
    const correctOption = parseInt(container.querySelector(`#correct-option-${index + 1}`).value, 10);

    questions.push({ questionText, options, correctOption });
  });

  quizzes.push({ title: quizTitle, questions });
  localStorage.setItem('quizzes', JSON.stringify(quizzes));

  document.getElementById('quiz-form').reset();
  document.getElementById('questions-container').innerHTML = '';

  showSection('quiz-list');
});

function loadQuizzes() {
  quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
  const quizListContainer = document.getElementById('quiz-list-container');
  quizListContainer.innerHTML = '';

  quizzes.forEach((quiz, index) => {
    const li = document.createElement('li');
    li.textContent = quiz.title;
    li.addEventListener('click', () => startQuiz(index));
    quizListContainer.appendChild(li);
  });
}

function startQuiz(quizIndex) {
  const quiz = quizzes[quizIndex];
  document.getElementById('quiz-title-display').textContent = quiz.title;
  const takeQuizForm = document.getElementById('take-quiz-form');
  takeQuizForm.innerHTML = '';

  quiz.questions.forEach((question, index) => {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-container';
    questionDiv.innerHTML = `
      <p>${question.questionText}</p>
      ${question.options.map((option, i) => `
        <label>
          <input type="radio" name="question-${index}" value="${i + 1}" required>
          ${option}
        </label>
      `).join('')}
    `;
    takeQuizForm.appendChild(questionDiv);
  });

  showSection('take-quiz');
}

function submitQuiz() {
  const takeQuizForm = document.getElementById('take-quiz-form');
  const quizTitle = document.getElementById('quiz-title-display').textContent;
  const quiz = quizzes.find(q => q.title === quizTitle);

  let score = 0;
  quiz.questions.forEach((question, index) => {
    const selectedOption = parseInt(takeQuizForm[`question-${index}`].value, 10);
    if (selectedOption === question.correctOption) {
      score++;
    }
  });

  const totalQuestions = quiz.questions.length;
  const percentageScore = (score / totalQuestions) * 100;
  document.getElementById('quiz-score').textContent = `Your score is: ${score} / ${totalQuestions} (${percentageScore}%)`;
  showSection('quiz-result');
}

document.getElementById('register-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;

  if (users.some(user => user.username === username)) {
    alert('Username already exists. Please choose another one.');
  } else {
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registration successful. Please login.');
    showSection('login');
  }
});

document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  const user = users.find(user => user.username === username && user.password === password);
  if (user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    alert('Login successful.');
    document.getElementById('register-btn').classList.add('hidden');
    document.getElementById('login-btn').classList.add('hidden');
    document.getElementById('logout-btn').classList.remove('hidden');
    showSection('home');
  } else {
    alert('Invalid username or password.');
  }
});

function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  document.getElementById('register-btn').classList.remove('hidden');
  document.getElementById('login-btn').classList.remove('hidden');
  document.getElementById('logout-btn').classList.add('hidden');
  showSection('home');
}

document.addEventListener('DOMContentLoaded', function() {
  users = JSON.parse(localStorage.getItem('users')) || [];
  currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

  if (currentUser) {
    document.getElementById('register-btn').classList.add('hidden');
    document.getElementById('login-btn').classList.add('hidden');
    document.getElementById('logout-btn').classList.remove('hidden');
  }

  showSection('home');
});
