const TOTAL_QUESTIONS = 50;

const subject =
  localStorage.getItem("selectedSubject") || "GENERAL SCIENCE";

const selectedClass =
  localStorage.getItem("selectedClass") || "9TH";

let questions = [];
let currentQuestion = 0;
let score = 0;
let answered = false;


/* ================================
   QUESTION DATABASE
================================ */

const questionDatabase = {

  "GENERAL SCIENCE": {
    "9TH": [],
    "10TH": [],
    "11TH": [],
    "12TH": []
  },

  "MATHEMATICS": {
    "9TH": [],
    "10TH": [],
    "11TH": [],
    "12TH": []
  },

  "SOCIAL SCIENCE": {
    "9TH": [],
    "10TH": [],
    "11TH": [],
    "12TH": []
  },

  "ENGLISH": {
    "9TH": [],
    "10TH": [],
    "11TH": [],
    "12TH": []
  }

};


/* ================================
   RANDOM NUMBER
================================ */

function randomNumber(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}


/* ================================
   SHUFFLE
================================ */

function shuffle(array) {

  for (let i = array.length - 1; i > 0; i--) {

    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [array[i], array[j]] =
      [array[j], array[i]];
  }

  return array;
}


/* ================================
   MATH RANDOM QUESTION
================================ */

/*
   X - Z = Y

   X = random
   Z = random
   Y = calculated

   Har baar alag numbers aa sakte hain.
*/

function createMathQuestion() {

  const x = randomNumber(10, 100);
  const z = randomNumber(1, x - 1);

  const y = x - z;

  return {

    question: `${x} - ${z} = ?`,

    options: generateMathOptions(y),

    answer: y

  };
}


/* ================================
   MATH OPTIONS
================================ */

function generateMathOptions(correctAnswer) {

  const answers = new Set();

  answers.add(correctAnswer);

  while (answers.size < 4) {

    const wrongAnswer =
      correctAnswer +
      randomNumber(-10, 10);

    if (wrongAnswer !== correctAnswer) {
      answers.add(wrongAnswer);
    }
  }

  return shuffle(
    Array.from(answers)
  );
}


/* ================================
   LOAD QUESTIONS
================================ */

function loadQuestions() {

  questions = [];

  const subjectData =
    questionDatabase[subject];

  if (
    subjectData &&
    subjectData[selectedClass]
  ) {

    questions =
      [...subjectData[selectedClass]];

  }


  /*
     Mathematics ke questions
     random generate honge.
  */

  if (subject === "MATHEMATICS") {

    for (
      let i = 0;
      i < TOTAL_QUESTIONS;
      i++
    ) {

      questions.push(
        createMathQuestion()
      );

    }
  }


  /*
     Question order random.
  */

  questions = shuffle(questions);


  /*
     Maximum 50.
  */

  questions =
    questions.slice(
      0,
      TOTAL_QUESTIONS
    );


  if (questions.length === 0) {

    document.getElementById("question")
      .textContent =
      "No questions available yet.";

    document.getElementById("options")
      .style.display = "none";

    document.getElementById("nextBtn")
      .style.display = "none";

    return;
  }


  showQuestion();
}


/* ================================
   SHOW QUESTION
================================ */

function showQuestion() {

  answered = false;

  const q =
    questions[currentQuestion];


  document.getElementById("question")
    .textContent =
    q.question;


  document.getElementById("progress")
    .textContent =
    `Question ${currentQuestion + 1} / ${questions.length}`;


  const buttons =
    document.querySelectorAll(".option");


  buttons.forEach(
    (button, index) => {

      button.disabled = false;

      button.classList.remove(
        "correct",
        "wrong"
      );

      button.textContent =
        q.options[index];

    }
  );


  document.getElementById("nextBtn")
    .disabled = true;
}


/* ================================
   SELECT ANSWER
================================ */

function selectAnswer(index) {

  if (answered) return;

  answered = true;

  const q =
    questions[currentQuestion];

  const selected =
    q.options[index];


  const buttons =
    document.querySelectorAll(".option");


  if (
    String(selected) ===
    String(q.answer)
  ) {

    score++;

    buttons[index]
      .classList.add("correct");

  } else {

    buttons[index]
      .classList.add("wrong");


    q.options.forEach(
      (option, i) => {

        if (
          String(option) ===
          String(q.answer)
        ) {

          buttons[i]
            .classList.add("correct");

        }

      }
    );
  }


  buttons.forEach(
    button => {
      button.disabled = true;
    }
  );


  document.getElementById("nextBtn")
    .disabled = false;
}


/* ================================
   NEXT QUESTION
================================ */

function nextQuestion() {

  if (!answered) return;

  currentQuestion++;


  if (
    currentQuestion >=
    questions.length
  ) {

    showResult();

  } else {

    showQuestion();

  }
}


/* ================================
   RESULT
================================ */

function showResult() {

  document.getElementById("question-box")
    .style.display = "none";

  document.getElementById("nextBtn")
    .style.display = "none";

  document.getElementById("quiz-header")
    .style.display = "none";

  document.getElementById("result")
    .style.display = "block";


  document.getElementById("score")
    .textContent =
    `Your Score: ${score} / ${questions.length}`;
}


/* ================================
   RESTART
================================ */

function restartQuiz() {

  currentQuestion = 0;
  score = 0;
  answered = false;


  document.getElementById("result")
    .style.display = "none";

  document.getElementById("quiz-header")
    .style.display = "block";

  document.getElementById("question-box")
    .style.display = "block";

  document.getElementById("nextBtn")
    .style.display = "block";


  loadQuestions();
}


/* ================================
   START QUIZ
================================ */

loadQuestions();
