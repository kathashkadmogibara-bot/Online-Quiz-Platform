// ========================================
// MCQ QUIZ SYSTEM
// 15 RANDOM QUESTIONS
// 1 MINUTE PER QUESTION
// ========================================

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
let totalTimeUsed = 0;


// ========================================
// GET ELEMENT
// ========================================

function el(id) {
  return document.getElementById(id);
}


// ========================================
// SUBJECT SELECTION
// ========================================

function selectSubject(subject) {

  selectedSubject = subject;

  el("subjectScreen").classList.remove("active");
  el("classScreen").classList.add("active");

  const names = {
    general: "GENERAL SCIENCE",
    math: "MATHEMATICS",
    social: "SOCIAL SCIENCE",
    english: "ENGLISH",
    all: "ALL SUBJECTS"
  };

  el("classTitle").textContent =
    "Choose Class - " + (names[subject] || subject);
}


// ========================================
// CLASS SELECTION
// ========================================

function selectClass(classNumber) {

  selectedClass = String(classNumber);

  startQuiz();
}


// ========================================
// BACK TO SUBJECTS
// ========================================

function goToSubjects() {

  stopTimer();

  el("classScreen").classList.remove("active");
  el("quizScreen").classList.remove("active");
  el("resultScreen").classList.remove("active");

  el("subjectScreen").classList.add("active");

  selectedSubject = "";
  selectedClass = "";
}


// ========================================
// GET QUESTION POOL
// ========================================

function getQuestionPool() {

  let pool = [];

  if (selectedSubject === "math") {

    if (typeof mathQuestions !== "undefined") {
      pool = mathQuestions;
    }

  } else if (
    selectedSubject === "general" ||
    selectedSubject === "science"
  ) {

    if (typeof scienceQuestions !== "undefined") {
      pool = scienceQuestions;
    }

  } else if (selectedSubject === "social") {

    if (typeof socialQuestions !== "undefined") {
      pool = socialQuestions;
    }

  } else if (selectedSubject === "english") {

    if (typeof englishQuestions !== "undefined") {
      pool = englishQuestions;
    }

  } else if (selectedSubject === "all") {

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

  // Select only chosen class
  pool = pool.filter(function(q) {

    return String(q.class) === String(selectedClass);

  });

  return pool;
}


// ========================================
// SHUFFLE
// ========================================

function shuffle(array) {

  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}


// ========================================
// START QUIZ
// ========================================

function startQuiz() {

  const pool = getQuestionPool();

  if (!pool || pool.length === 0) {

    alert(
      "No questions found for " +
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

  totalTimeUsed = 0;

  el("classScreen").classList.remove("active");
  el("subjectScreen").classList.remove("active");
  el("resultScreen").classList.remove("active");

  el("quizScreen").classList.add("active");

  el("subjectName").textContent = getSubjectName();

  el("className").textContent =
    "Class " + selectedClass;

  el("totalQuestions").textContent =
    quizQuestions.length;

  showQuestion();
}


// ========================================
// SUBJECT NAME
// ========================================

function getSubjectName() {

  const names = {

    general: "GENERAL SCIENCE",

    science: "GENERAL SCIENCE",

    math: "MATHEMATICS",

    social: "SOCIAL SCIENCE",

    english: "ENGLISH",

    all: "ALL SUBJECTS"
  };

  return names[selectedSubject] || selectedSubject;
}


// ========================================
// SHOW QUESTION
// ========================================

function showQuestion() {

  if (!quizQuestions.length) {
    return;
  }

  const question = quizQuestions[currentQuestion];

  el("questionNumber").textContent =
    currentQuestion + 1;

  el("sideQuestion").textContent =
    (currentQuestion + 1) +
    " / " +
    quizQuestions.length;

  el("questionText").textContent =
    question.question || question.q || "Question";

  const optionsContainer =
    el("optionsContainer");

  optionsContainer.innerHTML = "";

  let options = question.options || [];

  options.forEach(function(option, index) {

    const button = document.createElement("button");

    button.className = "option-btn";

    button.textContent =
      String.fromCharCode(65 + index) +
      ". " +
      option;

    button.dataset.index = index;

    button.onclick = function() {

      selectAnswer(index);

    };

    optionsContainer.appendChild(button);

  });

  // Restore previous answer
  if (answers[currentQuestion] !== null) {

    highlightAnswer(
      answers[currentQuestion]
    );
  }

  updateProgress();

  updateAnalytics();

  startTimer();
}


// ========================================
// SELECT ANSWER
// ========================================

function selectAnswer(index) {

  answers[currentQuestion] = index;

  skipped[currentQuestion] = false;

  highlightAnswer(index);

  updateAnalytics();
}


// ========================================
// HIGHLIGHT ANSWER
// ========================================

function highlightAnswer(index) {

  const buttons =
    document.querySelectorAll(".option-btn");

  buttons.forEach(function(button, i) {

    button.classList.remove("selected");

    if (i === index) {
      button.classList.add("selected");
    }

  });
}


// ========================================
// SKIP
// ========================================

function skipQuestion() {

  answers[currentQuestion] = null;

  skipped[currentQuestion] = true;

  nextQuestion();
}


// ========================================
// SAVE & NEXT
// ========================================

function saveAndNext() {

  skipped[currentQuestion] = false;

  saveQuizData();

  nextQuestion();
}


// ========================================
// NEXT
// ========================================

function nextQuestion() {

  if (currentQuestion <
      quizQuestions.length - 1) {

    currentQuestion++;

    showQuestion();

  } else {

    finishQuiz();
  }
}


// ========================================
// PREVIOUS
// ========================================

function previousQuestion() {

  if (currentQuestion > 0) {

    currentQuestion--;

    showQuestion();
  }
}


// ========================================
// TIMER
// ========================================

function startTimer() {

  stopTimer();

  timeLeft = TIME_PER_QUESTION;

  updateTimer();

  timer = setInterval(function() {

    timeLeft--;

    totalTimeUsed++;

    updateTimer();

    updateAnalytics();

    if (timeLeft <= 0) {

      stopTimer();

      // Automatically move to next question
      if (currentQuestion <
          quizQuestions.length - 1) {

        currentQuestion++;

        showQuestion();

      } else {

        finishQuiz();
      }
    }

  }, 1000);
}


// ========================================
// STOP TIMER
// ========================================

function stopTimer() {

  if (timer !== null) {

    clearInterval(timer);

    timer = null;
  }
}


// ========================================
// TIMER DISPLAY
// ========================================

function updateTimer() {

  const minutes =
    Math.floor(timeLeft / 60);

  const seconds =
    timeLeft % 60;

  el("timer").textContent =

    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0");
}


// ========================================
// PROGRESS
// ========================================

function updateProgress() {

  const progress =
    ((currentQuestion + 1) /
      quizQuestions.length) * 100;

  el("progressBar").style.width =
    progress + "%";
}


// ========================================
// ANALYTICS
// ========================================

function updateAnalytics() {

  let answered = 0;
  let skippedCount = 0;

  answers.forEach(function(answer, index) {

    if (answer !== null) {
      answered++;
    }

    if (skipped[index]) {
      skippedCount++;
    }

  });

  let correct = 0;
  let wrong = 0;

  answers.forEach(function(answer, index) {

    if (answer === null) {
      return;
    }

    const question =
      quizQuestions[index];

    if (isCorrect(question, answer)) {

      correct++;

    } else {

      wrong++;
    }

  });

  el("answeredCount").textContent =
    answered;

  el("correctCount").textContent =
    correct;

  el("wrongCount").textContent =
    wrong;

  el("skippedCount").textContent =
    skippedCount;

  el("timeUsed").textContent =
    formatTime(totalTimeUsed);
}


// ========================================
// CHECK CORRECT ANSWER
// ========================================

function isCorrect(question, answerIndex) {

  if (
    question.answer !== undefined
  ) {

    if (
      typeof question.answer === "number"
    ) {

      return answerIndex === question.answer;
    }

    if (
      typeof question.answer === "string"
    ) {

      const correctIndex =
        question.options.indexOf(
          question.answer
        );

      return answerIndex === correctIndex;
    }
  }

  if (
    question.correctAnswer !== undefined
  ) {

    if (
      typeof question.correctAnswer === "number"
    ) {

      return answerIndex ===
        question.correctAnswer;
    }

    if (
      typeof question.correctAnswer === "string"
    ) {

      const correctIndex =
        question.options.indexOf(
          question.correctAnswer
        );

      return answerIndex === correctIndex;
    }
  }

  return false;
}


// ========================================
// FINISH QUIZ
// ========================================

function finishQuiz() {

  stopTimer();

  const totalQuestions =
    quizQuestions.length;

  let correct = 0;
  let wrong = 0;
  let skippedCount = 0;

  answers.forEach(function(answer, index) {

    if (answer === null) {

      skippedCount++;

      return;
    }

    if (
      isCorrect(
        quizQuestions[index],
        answer
      )
    ) {

      correct++;

    } else {

      wrong++;
    }

  });

  const percentage =
    Math.round(
      (correct / totalQuestions) * 100
    );

  el("quizScreen").classList.remove("active");

  el("resultScreen").classList.add("active");

  el("finalMarks").textContent =
    correct + " / " + totalQuestions;

  el("finalCorrect").textContent =
    correct;

  el("finalWrong").textContent =
    wrong;

  el("finalSkipped").textContent =
    skippedCount;

  el("finalTime").textContent =
    formatTime(totalTimeUsed);

  const minutes =
    totalTimeUsed / 60;

  const qpm =
    minutes > 0
      ? (totalQuestions / minutes).toFixed(2)
      : totalQuestions;

  el("questionsPerMinute").textContent =
    qpm;

  el("resultPercent").textContent =
    percentage + "%";

  setResultLevel(correct);

  el("resultMessage").textContent =
    getResultMessage(percentage);
}


// ========================================
// RESULT LEVEL
// ========================================

function setResultLevel(correct) {

  const level =
    el("resultLevel");

  const circle =
    el("resultCircle");

  if (correct >= 1 && correct <= 3) {

    level.textContent =
      "🔴 RED";

    circle.style.borderColor =
      "red";

  } else if (
    correct >= 4 &&
    correct <= 6
  ) {

    level.textContent =
      "🟠 ORANGE";

    circle.style.borderColor =
      "orange";

  } else if (
    correct >= 7 &&
    correct <= 10
  ) {

    level.textContent =
      "🟡 YELLOW";

    circle.style.borderColor =
      "gold";

  } else if (
    correct >= 11 &&
    correct <= 15
  ) {

    level.textContent =
      "🟢 GREEN";

    circle.style.borderColor =
      "green";

  } else {

    level.textContent =
      "No correct answers";

    circle.style.borderColor =
      "red";
  }
}


// ========================================
// RESULT MESSAGE
// ========================================

function getResultMessage(percentage) {

  if (percentage >= 80) {

    return "Excellent! 🔥";

  }

  if (percentage >= 60) {

    return "Good Job! 👍";

  }

  if (percentage >= 40) {

    return "Keep Practicing! 💪";

  }

  return "Try Again! 📚";
}


// ========================================
// FORMAT TIME
// ========================================

function formatTime(seconds) {

  const minutes =
    Math.floor(seconds / 60);

  const secs =
    seconds % 60;

  return (
    minutes +
    ":" +
    String(secs).padStart(2, "0")
  );
}


// ========================================
// RESTART QUIZ
// ========================================

function restartQuiz() {

  stopTimer();

  startQuiz();
}


// ========================================
// SAVE QUIZ DATA
// ========================================

function saveQuizData() {

  const data = {

    subject: selectedSubject,

    class: selectedClass,

    questions: quizQuestions,

    answers: answers,

    skipped: skipped,

    currentQuestion: currentQuestion,

    startTime: quizStartTime,

    totalTimeUsed: totalTimeUsed
  };

  localStorage.setItem(
    "mcqQuizData",
    JSON.stringify(data)
  );
}


// ========================================
// AUTO SAVE
// ========================================

setInterval(function() {

  if (quizQuestions.length > 0) {

    saveQuizData();
  }

}, 5000);
