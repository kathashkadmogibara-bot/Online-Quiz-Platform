// ===============================
// MCQ QUIZ SYSTEM
// 15 RANDOM QUESTIONS
// 1 MINUTE PER QUESTION
// ===============================

const QUESTIONS_PER_QUIZ = 15;
const TIME_PER_QUESTION = 60;

let selectedSubject = "";
let selectedClass = "";

let quizQuestions = [];
let currentQuestion = 0;
let answers = [];
let skipped = [];
let timer = null;
let timeLeft = TIME_PER_QUESTION;
let quizStartTime = 0;

// -------------------------------
// SUBJECT SELECTION
// -------------------------------

document.querySelectorAll(".subject-btn").forEach(button => {
  button.addEventListener("click", () => {

    selectedSubject = button.dataset.subject;

    document.getElementById("subjectMenu").classList.add("hidden");
    document.getElementById("classMenu").classList.remove("hidden");
  });
});

// -------------------------------
// CLASS SELECTION
// -------------------------------

document.querySelectorAll(".class-btn").forEach(button => {
  button.addEventListener("click", () => {

    selectedClass = button.dataset.class;

    startQuiz();
  });
});

// -------------------------------
// BACK TO SUBJECT
// -------------------------------

const backSubject = document.getElementById("backSubject");

if (backSubject) {
  backSubject.addEventListener("click", () => {

    document.getElementById("classMenu").classList.add("hidden");
    document.getElementById("subjectMenu").classList.remove("hidden");
  });
}

// -------------------------------
// GET QUESTIONS
// -------------------------------

function getQuestionPool() {

  let pool = [];

  if (selectedSubject === "math") {
    pool = typeof mathQuestions !== "undefined"
      ? mathQuestions
      : [];
  }

  else if (selectedSubject === "science") {
    pool = typeof scienceQuestions !== "undefined"
      ? scienceQuestions
      : [];
  }

  else if (selectedSubject === "social") {
    pool = typeof socialQuestions !== "undefined"
      ? socialQuestions
      : [];
  }

  else if (selectedSubject === "english") {
    pool = typeof englishQuestions !== "undefined"
      ? englishQuestions
      : [];
  }

  else if (selectedSubject === "all") {

    if (typeof mathQuestions !== "undefined") {
      pool = pool.concat(mathQuestions);
    }

    if (typeof scienceQuestions !== "undefined") {
      pool = pool.concat(scienceQuestions);
    }

    if (typeof socialQuestions !== "undefined") {
      pool = pool.concat(socialQuestions);
    }

    if (typeof englishQuestions !== "undefined") {
      pool = pool.concat(englishQuestions);
    }
  }

  // Only selected class
  pool = pool.filter(q => {
    return String(q.class) === String(selectedClass);
  });

  return pool;
}

// -------------------------------
// RANDOMIZE
// -------------------------------

function shuffle(array) {

  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

// -------------------------------
// START QUIZ
// -------------------------------

function startQuiz() {

  const pool = getQuestionPool();

  if (!pool.length) {

    alert(
      "No question found for " +
      selectedSubject +
      " - Class " +
      selectedClass
    );

    return;
  }

  quizQuestions = shuffle(pool).slice(
    0,
    Math.min(QUESTIONS_PER_QUIZ, pool.length)
  );

  currentQuestion = 0;

  answers = new Array(quizQuestions.length).fill(null);

  skipped = new Array(quizQuestions.length).fill(false);

  quizStartTime = Date.now();

  window.location.href = "test.html";
}

// -------------------------------
// QUIZ DATA FOR test.html
// -------------------------------

function saveQuizData() {

  const data = {

    subject: selectedSubject,

    class: selectedClass,

    questions: quizQuestions,

    answers: answers,

    skipped: skipped,

    currentQuestion: currentQuestion,

    startTime: quizStartTime
  };

  localStorage.setItem(
    "mcqQuizData",
    JSON.stringify(data)
  );
}

// Save automatically before page change
window.addEventListener("beforeunload", saveQuizData);
