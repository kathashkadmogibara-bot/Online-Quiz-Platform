// ==========================================
// MCQ QUIZ SYSTEM
// 15 RANDOM QUESTIONS
// 1 MINUTE PER QUESTION
// ==========================================

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

let totalTimeUsed = 0;
let quizStartTime = 0;


// ==========================================
// ELEMENT HELPER
// ==========================================

function get(id) {
  return document.getElementById(id);
}


// ==========================================
// SUBJECT
// ==========================================

function selectSubject(subject) {

  selectedSubject = subject;

  // Hide subject screen
  get("subjectScreen").classList.remove("active");

  // Show class screen
  get("classScreen").classList.add("active");

  const subjectNames = {
    general: "GENERAL SCIENCE",
    math: "MATHEMATICS",
    social: "SOCIAL SCIENCE",
    english: "ENGLISH",
    all: "ALL SUBJECTS"
  };

  get("classTitle").textContent =
    (subjectNames[subject] || subject) +
    " - Choose Class";
}


// ==========================================
// CLASS
// ==========================================

function selectClass(classNumber) {

  selectedClass = String(classNumber);

  startQuiz();
}


// ==========================================
// BACK TO SUBJECT
// ==========================================

function goToSubjects() {

  stopTimer();

  get("classScreen").classList.remove("active");
  get("quizScreen").classList.remove("active");
  get("resultScreen").classList.remove("active");

  get("subjectScreen").classList.add("active");
}


// ==========================================
// GET QUESTIONS
// ==========================================

function getQuestionPool() {

  let pool = [];

  // MATHEMATICS
  if (selectedSubject === "math") {

    if (typeof mathQuestions !== "undefined") {
      pool = mathQuestions;
    }
  }

  // GENERAL SCIENCE
  else if (selectedSubject === "general") {

    if (typeof scienceQuestions !== "undefined") {
      pool = scienceQuestions;
    }
  }

  // SOCIAL SCIENCE
  else if (selectedSubject === "social") {

    if (typeof socialQuestions !== "undefined") {
      pool = socialQuestions;
    }
  }

  // ENGLISH
  else if (selectedSubject === "english") {

    if (typeof englishQuestions !== "undefined") {
      pool = englishQuestions;
    }
  }

  // ALL SUBJECTS
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

  // CLASS FILTER
  pool = pool.filter(function(question) {

    return String(question.class) ===
           String(selectedClass);

  });

  return pool;
}


// ==========================================
// SHUFFLE
// ==========================================

function shuffle(array) {

  let result = [...array];

  for (
    let i = result.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(Math.random() * (i + 1));

    [
      result[i],
      result[j]
    ] = [
      result[j],
      result[i]
    ];
  }

  return result;
}


// ==========================================
// START QUIZ
// ==========================================

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

  quizQuestions =
    shuffle(pool).slice(
      0,
      Math.min(
        QUESTIONS_PER_QUIZ,
        pool.length
      )
    );

  currentQuestion = 0;

  answers =
    new Array(
      quizQuestions.length
    ).fill(null);

  skipped =
    new Array(
      quizQuestions.length
    ).fill(false);

  totalTimeUsed = 0;

  quizStartTime = Date.now();

  // Screens
  get("subjectScreen")
    .classList.remove("active");

  get("classScreen")
    .classList.remove("active");

  get("resultScreen")
    .classList.remove("active");

  get("quizScreen")
    .classList.add("active");

  // Header
  get("subjectName").textContent =
    getSubjectName();

  get("className").textContent =
    "Class " + selectedClass;

  get("totalQuestions").textContent =
    quizQuestions.length;

  showQuestion();
}


// ==========================================
// SUBJECT NAME
// ==========================================

function getSubjectName() {

  const names = {

    general: "GENERAL SCIENCE",
    math: "MATHEMATICS",
    social: "SOCIAL SCIENCE",
    english: "ENGLISH",
    all: "ALL SUBJECTS"

  };

  return names[selectedSubject] ||
         selectedSubject;
}


// ==========================================
// SHOW QUESTION
// ==========================================

function showQuestion() {

  if (!quizQuestions.length) {
    return;
  }

  const question =
    quizQuestions[currentQuestion];

  // Number
  get("questionNumber").textContent =
    currentQuestion + 1;

  get("sideQuestion").textContent =
    (currentQuestion + 1) +
    " / " +
    quizQuestions.length;

  // Question text
  get("questionText").textContent =
    question.question ||
    question.q ||
    "Question not available";


  // Options
  const container =
    get("optionsContainer");

  container.innerHTML = "";

  const options =
    question.options || [];


  options.forEach(function(option, index) {

    const button =
      document.createElement("button");

    button.className =
      "option-btn";

    button.textContent =
      String.fromCharCode(65 + index) +
      ". " +
      option;

    button.onclick = function() {

      selectAnswer(index);

    };

    container.appendChild(button);

  });


  // Restore answer
  if (answers[currentQuestion] !== null) {

    highlightAnswer(
      answers[currentQuestion]
    );
  }


  updateProgress();

  updateAnalytics();

  startTimer();
}


// ==========================================
// SELECT ANSWER
// ==========================================

function selectAnswer(index) {

  answers[currentQuestion] = index;

  skipped[currentQuestion] = false;

  highlightAnswer(index);

  updateAnalytics();

  saveQuizData();
}


// ==========================================
// HIGHLIGHT ANSWER
// ==========================================

function highlightAnswer(index) {

  const buttons =
    document.querySelectorAll(
      ".option-btn"
    );

  buttons.forEach(function(button, i) {

    button.classList.remove(
      "selected"
    );

    if (i === index) {

      button.classList.add(
        "selected"
      );
    }

  });
}


// ==========================================
// SKIP
// ==========================================

function skipQuestion() {

  answers[currentQuestion] = null;

  skipped[currentQuestion] = true;

  saveQuizData();

  nextQuestion();
}


// ==========================================
// SAVE & NEXT
// ==========================================

function saveAndNext() {

  skipped[currentQuestion] = false;

  saveQuizData();

  nextQuestion();
}


// ==========================================
// NEXT
// ==========================================

function nextQuestion() {

  if (
    currentQuestion <
    quizQuestions.length - 1
  ) {

    currentQuestion++;

    showQuestion();

  } else {

    finishQuiz();
  }
}


// ==========================================
// BACK
// ==========================================

function previousQuestion() {

  if (currentQuestion > 0) {

    currentQuestion--;

    showQuestion();
  }
}


// ==========================================
// TIMER
// ==========================================

function startTimer() {

  stopTimer();

  timeLeft =
    TIME_PER_QUESTION;

  updateTimer();

  timer =
    setInterval(function() {

      timeLeft--;

      totalTimeUsed++;

      updateTimer();

      updateAnalytics();

      if (timeLeft <= 0) {

        stopTimer();

        if (
          currentQuestion <
          quizQuestions.length - 1
        ) {

          currentQuestion++;

          showQuestion();

        } else {

          finishQuiz();
        }
      }

    }, 1000);
}


// ==========================================
// STOP TIMER
// ==========================================

function stopTimer() {

  if (timer !== null) {

    clearInterval(timer);

    timer = null;
  }
}


// ==========================================
// TIMER DISPLAY
// ==========================================

function updateTimer() {

  const minutes =
    Math.floor(timeLeft / 60);

  const seconds =
    timeLeft % 60;

  get("timer").textContent =
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0");
}


// ==========================================
// PROGRESS
// ==========================================

function updateProgress() {

  const percent =
    (
      (currentQuestion + 1) /
      quizQuestions.length
    ) * 100;

  get("progressBar").style.width =
    percent + "%";
}


// ==========================================
// ANALYTICS
// ==========================================

function updateAnalytics() {

  let answered = 0;
  let skippedCount = 0;
  let correct = 0;
  let wrong = 0;


  answers.forEach(function(answer, index) {

    if (answer !== null) {

      answered++;

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
    }

    if (skipped[index]) {

      skippedCount++;
    }

  });


  get("answeredCount").textContent =
    answered;

  get("correctCount").textContent =
    correct;

  get("wrongCount").textContent =
    wrong;

  get("skippedCount").textContent =
    skippedCount;

  get("timeUsed").textContent =
    formatTime(totalTimeUsed);
}


// ==========================================
// CHECK ANSWER
// ==========================================

function isCorrect(
  question,
  answerIndex
) {

  // answer = number
  if (
    typeof question.answer ===
    "number"
  ) {

    return answerIndex ===
           question.answer;
  }


  // answer = text
  if (
    typeof question.answer ===
    "string"
  ) {

    return question.options[
      answerIndex
    ] === question.answer;
  }


  // correctAnswer = number
  if (
    typeof question.correctAnswer ===
    "number"
  ) {

    return answerIndex ===
           question.correctAnswer;
  }


  // correctAnswer = text
  if (
    typeof question.correctAnswer ===
    "string"
  ) {

    return question.options[
      answerIndex
    ] === question.correctAnswer;
  }


  return false;
}


// ==========================================
// FINISH
// ==========================================

function finishQuiz() {

  stopTimer();

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


  const total =
    quizQuestions.length;


  const percentage =
    Math.round(
      (correct / total) * 100
    );


  // Screens
  get("quizScreen")
    .classList.remove("active");

  get("resultScreen")
    .classList.add("active");


  // Results
  get("finalMarks").textContent =
    correct + " / " + total;

  get("finalCorrect").textContent =
    correct;

  get("finalWrong").textContent =
    wrong;

  get("finalSkipped").textContent =
    skippedCount;

  get("finalTime").textContent =
    formatTime(totalTimeUsed);

  get("resultPercent").textContent =
    percentage + "%";


  const minutes =
    totalTimeUsed / 60;


  const qpm =
    minutes > 0
      ? (total / minutes).toFixed(2)
      : total;


  get("questionsPerMinute").textContent =
    qpm;


  setResultLevel(correct);

  get("resultMessage").textContent =
    getResultMessage(percentage);


  saveQuizData();
}


// ==========================================
// RESULT LEVEL
// ==========================================

function setResultLevel(correct) {

  const level =
    get("resultLevel");

  const circle =
    get("resultCircle");


  if (
    correct >= 1 &&
    correct <= 3
  ) {

    level.textContent =
      "🔴 RED";

    circle.style.borderColor =
      "red";

  }

  else if (
    correct >= 4 &&
    correct <= 6
  ) {

    level.textContent =
      "🟠 ORANGE";

    circle.style.borderColor =
      "orange";

  }

  else if (
    correct >= 7 &&
    correct <= 10
  ) {

    level.textContent =
      "🟡 YELLOW";

    circle.style.borderColor =
      "gold";

  }

  else if (
    correct >= 11 &&
    correct <= 15
  ) {

    level.textContent =
      "🟢 GREEN";

    circle.style.borderColor =
      "green";

  }

  else {

    level.textContent =
      "🔴 0 CORRECT";

    circle.style.borderColor =
      "red";
  }
}


// ==========================================
// RESULT MESSAGE
// ==========================================

function getResultMessage(percent) {

  if (percent >= 80) {

    return "Excellent! 🔥";
  }

  if (percent >= 60) {

    return "Good Job! 👍";
  }

  if (percent >= 40) {

    return "Keep Practicing! 💪";
  }

  return "Try Again! 📚";
}


// ==========================================
// FORMAT TIME
// ==========================================

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


// ==========================================
// RESTART
// ==========================================

function restartQuiz() {

  stopTimer();

  startQuiz();
}


// ==========================================
// SAVE DATA
// ==========================================

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


// ==========================================
// AUTO SAVE
// ==========================================

setInterval(function() {

  if (quizQuestions.length > 0) {

    saveQuizData();
  }

}, 5000);
