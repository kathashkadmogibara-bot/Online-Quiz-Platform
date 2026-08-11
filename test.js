// ==========================================
// MCQ QUIZ SETTINGS
// ==========================================

const QUESTIONS_PER_QUIZ = 15;
const SECONDS_PER_QUESTION = 10;

// ==========================================
// GET QUESTIONS
// ==========================================

// Supports the question files you already created.
let allQuestions = [];

if (typeof questions !== "undefined" && Array.isArray(questions)) {
  allQuestions = questions;
}

// Other possible question variable names
if (typeof mathQuestions !== "undefined") {
  allQuestions = allQuestions.concat(mathQuestions);
}

if (typeof scienceQuestions !== "undefined") {
  allQuestions = allQuestions.concat(scienceQuestions);
}

if (typeof socialQuestions !== "undefined") {
  allQuestions = allQuestions.concat(socialQuestions);
}

if (typeof englishQuestions !== "undefined") {
  allQuestions = allQuestions.concat(englishQuestions);
}

// ==========================================
// RANDOM SHUFFLE
// ==========================================

function shuffle(array) {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

// ==========================================
// CREATE 15 RANDOM QUESTIONS
// ==========================================

let quizQuestions = shuffle(allQuestions).slice(
  0,
  Math.min(QUESTIONS_PER_QUIZ, allQuestions.length)
);

// ==========================================
// QUIZ DATA
// ==========================================

let currentIndex = 0;

let selectedAnswers = new Array(
  quizQuestions.length
).fill(null);

let timer = SECONDS_PER_QUESTION;
let timerInterval = null;

// ==========================================
// HTML ELEMENTS
// ==========================================

const questionElement =
  document.getElementById("question");

const optionsElement =
  document.getElementById("options");

const currentQuestionElement =
  document.getElementById("currentQuestion");

const totalQuestionsElement =
  document.getElementById("totalQuestions");

const timerElement =
  document.getElementById("timer");

const progressBar =
  document.getElementById("progressBar");

const backBtn =
  document.getElementById("backBtn");

const skipBtn =
  document.getElementById("skipBtn");

const saveNextBtn =
  document.getElementById("saveNextBtn");

const resultBox =
  document.getElementById("resultBox");

const scoreElement =
  document.getElementById("score");

// ==========================================
// START
// ==========================================

totalQuestionsElement.textContent =
  quizQuestions.length;

if (quizQuestions.length === 0) {

  questionElement.textContent =
    "No questions found.";

  optionsElement.innerHTML =
    "<p>Please check your question files.</p>";

  backBtn.disabled = true;
  skipBtn.disabled = true;
  saveNextBtn.disabled = true;

} else {

  showQuestion();
}

// ==========================================
// SHOW QUESTION
// ==========================================

function showQuestion() {

  clearInterval(timerInterval);

  const q = quizQuestions[currentIndex];

  currentQuestionElement.textContent =
    currentIndex + 1;

  totalQuestionsElement.textContent =
    quizQuestions.length;

  questionElement.textContent =
    q.question || q.q || "Question unavailable";

  optionsElement.innerHTML = "";

  let options = q.options || q.answers || [];

  options.forEach((option, index) => {

    const button = document.createElement("button");

    button.className = "option";

    button.textContent =
      option;

    if (
      selectedAnswers[currentIndex] === index
    ) {
      button.classList.add("selected");
    }

    button.addEventListener("click", () => {

      selectedAnswers[currentIndex] =
        index;

      document
        .querySelectorAll(".option")
        .forEach(btn => {
          btn.classList.remove("selected");
        });

      button.classList.add("selected");
    });

    optionsElement.appendChild(button);
  });

  updateButtons();

  updateProgress();

  startTimer();
}

// ==========================================
// TIMER
// ==========================================

function startTimer() {

  timer = SECONDS_PER_QUESTION;

  timerElement.textContent = timer;

  timerInterval = setInterval(() => {

    timer--;

    timerElement.textContent =
      timer;

    if (timer <= 0) {

      clearInterval(timerInterval);

      autoNext();
    }

  }, 1000);
}

// ==========================================
// AUTOMATIC NEXT
// ==========================================

function autoNext() {

  if (
    currentIndex <
    quizQuestions.length - 1
  ) {

    currentIndex++;

    showQuestion();

  } else {

    finishQuiz();
  }
}

// ==========================================
// SAVE & NEXT
// ==========================================

saveNextBtn.addEventListener(
  "click",
  () => {

    if (
      currentIndex <
      quizQuestions.length - 1
    ) {

      currentIndex++;

      showQuestion();

    } else {

      finishQuiz();
    }
  }
);

// ==========================================
// SKIP
// ==========================================

skipBtn.addEventListener(
  "click",
  () => {

    if (
      currentIndex <
      quizQuestions.length - 1
    ) {

      // Leave answer as null
      currentIndex++;

      showQuestion();

    } else {

      finishQuiz();
    }
  }
);

// ==========================================
// BACK
// ==========================================

backBtn.addEventListener(
  "click",
  () => {

    if (currentIndex > 0) {

      currentIndex--;

      showQuestion();
    }
  }
);

// ==========================================
// BUTTON STATUS
// ==========================================

function updateButtons() {

  backBtn.disabled =
    currentIndex === 0;

  if (
    currentIndex ===
    quizQuestions.length - 1
  ) {

    saveNextBtn.textContent =
      "Save & Finish";

  } else {

    saveNextBtn.textContent =
      "Save & Next";
  }
}

// ==========================================
// PROGRESS BAR
// ==========================================

function updateProgress() {

  const percent =
    ((currentIndex + 1) /
      quizQuestions.length) * 100;

  progressBar.style.width =
    percent + "%";
}

// ==========================================
// FINISH QUIZ
// ==========================================

function finishQuiz() {

  clearInterval(timerInterval);

  let score = 0;

  quizQuestions.forEach(
    (q, index) => {

      const correct =
        q.answer ??
        q.correct ??
        q.correctAnswer;

      const selected =
        selectedAnswers[index];

      // Supports numeric correct answer
      if (
        typeof correct === "number" &&
        selected === correct
      ) {
        score++;
      }

      // Supports correct answer text
      else if (
        typeof correct === "string" &&
        selected !== null
      ) {

        const options =
          q.options ||
          q.answers ||
          [];

        if (
          options[selected] ===
          correct
        ) {
          score++;
        }
      }
    }
  );

  document
    .querySelector(".question-box")
    .classList.add("hidden");

  document
    .querySelector(".navigation")
    .classList.add("hidden");

  document
    .querySelector(".progress")
    .classList.add("hidden");

  document
    .querySelector(".timer-box")
    .classList.add("hidden");

  resultBox.classList.remove("hidden");

  scoreElement.textContent =
    score;
}
