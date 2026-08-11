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

let quizStartTime = 0;
let totalTimeUsed = 0;


// ==========================================
// SELECT SUBJECT
// ==========================================

function selectSubject(subject) {

    selectedSubject = subject;

    document.getElementById("subjectScreen").classList.remove("active");
    document.getElementById("classScreen").classList.add("active");

    let title = document.getElementById("classTitle");

    const names = {
        general: "GENERAL SCIENCE",
        math: "MATHEMATICS",
        social: "SOCIAL SCIENCE",
        english: "ENGLISH",
        all: "ALL SUBJECTS"
    };

    title.textContent = names[subject] + " - Choose Class";
}


// ==========================================
// SELECT CLASS
// ==========================================

function selectClass(classNumber) {

    selectedClass = String(classNumber);

    startQuiz();
}


// ==========================================
// GET QUESTION POOL
// ==========================================

function getQuestionPool() {

    let pool = [];

    // Mathematics
    if (selectedSubject === "math") {

        if (typeof mathQuestions !== "undefined") {
            pool = mathQuestions;
        }
    }

    // Science
    else if (
        selectedSubject === "science" ||
        selectedSubject === "general"
    ) {

        if (typeof scienceQuestions !== "undefined") {
            pool = scienceQuestions;
        }
    }

    // Social Science
    else if (selectedSubject === "social") {

        if (typeof socialQuestions !== "undefined") {
            pool = socialQuestions;
        }
    }

    // English
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

    // Filter class
    pool = pool.filter(function(question) {

        return String(question.class) === String(selectedClass);

    });

    return pool;
}


// ==========================================
// SHUFFLE
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
// START QUIZ
// ==========================================

function startQuiz() {

    const pool = getQuestionPool();

    if (!pool || pool.length === 0) {

        alert(
            "No questions found!\n\n" +
            "Subject: " + selectedSubject +
            "\nClass: " + selectedClass
        );

        return;
    }

    // Random 15 questions
    quizQuestions = shuffle(pool).slice(
        0,
        Math.min(QUESTIONS_PER_QUIZ, pool.length)
    );

    currentQuestion = 0;

    answers = new Array(
        quizQuestions.length
    ).fill(null);

    skipped = new Array(
        quizQuestions.length
    ).fill(false);

    quizStartTime = Date.now();

    totalTimeUsed = 0;

    // Save data
    saveQuizData();

    // Open test page
    window.location.href = "test.html";
}


// ==========================================
// SAVE QUIZ DATA
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
// BACK TO SUBJECT MENU
// ==========================================

function goToSubjects() {

    clearInterval(timer);

    localStorage.removeItem("mcqQuizData");

    document.getElementById("classScreen").classList.remove("active");

    document.getElementById("quizScreen").classList.remove("active");

    document.getElementById("resultScreen").classList.remove("active");

    document.getElementById("subjectScreen").classList.add("active");
}


// ==========================================
// RESTART QUIZ
// ==========================================

function restartQuiz() {

    document.getElementById("resultScreen").classList.remove("active");

    document.getElementById("quizScreen").classList.add("active");

    currentQuestion = 0;

    answers = new Array(
        quizQuestions.length
    ).fill(null);

    skipped = new Array(
        quizQuestions.length
    ).fill(false);

    quizStartTime = Date.now();

    totalTimeUsed = 0;

    showQuestion();
}


// ==========================================
// LOAD QUIZ DATA ON test.html
// ==========================================

function loadQuizData() {

    const saved = localStorage.getItem("mcqQuizData");

    if (!saved) {

        return false;
    }

    try {

        const data = JSON.parse(saved);

        selectedSubject = data.subject;

        selectedClass = data.class;

        quizQuestions = data.questions || [];

        answers = data.answers || [];

        skipped = data.skipped || [];

        currentQuestion = data.currentQuestion || 0;

        quizStartTime = data.startTime || Date.now();

        totalTimeUsed = data.totalTimeUsed || 0;

        return true;

    } catch (error) {

        console.error(
            "Quiz data error:",
            error
        );

        return false;
    }
}


// ==========================================
// SHOW QUESTION
// ==========================================

function showQuestion() {

    if (!quizQuestions.length) {

        alert("No questions loaded.");

        return;
    }

    const question =
        quizQuestions[currentQuestion];

    // Subject
    const subjectName =
        document.getElementById("subjectName");

    if (subjectName) {

        const names = {

            general: "GENERAL SCIENCE",

            math: "MATHEMATICS",

            social: "SOCIAL SCIENCE",

            english: "ENGLISH",

            all: "ALL SUBJECTS"
        };

        subjectName.textContent =
            names[selectedSubject] ||
            selectedSubject;
    }


    // Class
    const className =
        document.getElementById("className");

    if (className) {

        className.textContent =
            "Class " + selectedClass;
    }


    // Question number
    const questionNumber =
        document.getElementById("questionNumber");

    if (questionNumber) {

        questionNumber.textContent =
            currentQuestion + 1;
    }


    // Total
    const totalQuestions =
        document.getElementById("totalQuestions");

    if (totalQuestions) {

        totalQuestions.textContent =
            quizQuestions.length;
    }


    // Question text
    const questionText =
        document.getElementById("questionText");

    if (questionText) {

        questionText.textContent =
            question.question ||
            question.q ||
            "Question not found";
    }


    // Options
    const container =
        document.getElementById(
            "optionsContainer"
        );

    if (!container) return;

    container.innerHTML = "";


    let options =
        question.options ||
        question.answers ||
        [];


    options.forEach(function(option, index) {

        const button =
            document.createElement("button");

        button.className =
            "option-btn";

        button.textContent =
            option;

        button.dataset.index =
            index;


        // Already answered
        if (
            answers[currentQuestion] !== null &&
            answers[currentQuestion] !== undefined
        ) {

            if (
                Number(
                    answers[currentQuestion]
                ) === index
            ) {

                button.classList.add(
                    "selected"
                );
            }
        }


        button.onclick = function() {

            selectAnswer(index);
        };


        container.appendChild(button);

    });


    // Progress
    const progress =
        document.getElementById(
            "progressBar"
        );

    if (progress) {

        const percentage =
            ((currentQuestion + 1) /
                quizQuestions.length) *
            100;

        progress.style.width =
            percentage + "%";
    }


    // Sidebar
    updateAnalytics();


    // Timer
    startQuestionTimer();

}


// ==========================================
// SELECT ANSWER
// ==========================================

function selectAnswer(index) {

    answers[currentQuestion] =
        index;

    skipped[currentQuestion] =
        false;


    const buttons =
        document.querySelectorAll(
            ".option-btn"
        );


    buttons.forEach(function(button) {

        button.classList.remove(
            "selected"
        );

    });


    if (buttons[index]) {

        buttons[index].classList.add(
            "selected"
        );
    }


    updateAnalytics();

    saveQuizData();
}


// ==========================================
// SAVE & NEXT
// ==========================================

function saveAndNext() {

    saveQuizData();

    nextQuestion();
}


// ==========================================
// NEXT
// ==========================================

function nextQuestion() {

    stopTimer();

    totalTimeUsed +=
        TIME_PER_QUESTION -
        timeLeft;


    if (
        currentQuestion <
        quizQuestions.length - 1
    ) {

        currentQuestion++;

        saveQuizData();

        showQuestion();

    } else {

        finishQuiz();
    }
}


// ==========================================
// BACK
// ==========================================

function previousQuestion() {

    stopTimer();

    if (currentQuestion > 0) {

        currentQuestion--;

        saveQuizData();

        showQuestion();
    }
}


// ==========================================
// SKIP
// ==========================================

function skipQuestion() {

    answers[currentQuestion] =
        null;

    skipped[currentQuestion] =
        true;

    saveQuizData();

    nextQuestion();
}


// ==========================================
// TIMER
// ==========================================

function startQuestionTimer() {

    stopTimer();

    timeLeft =
        TIME_PER_QUESTION;

    updateTimerDisplay();


    timer = setInterval(function() {

        timeLeft--;

        updateTimerDisplay();


        if (timeLeft <= 0) {

            clearInterval(timer);

            skipped[currentQuestion] =
                true;

            nextQuestion();
        }

    }, 1000);
}


// ==========================================
// STOP TIMER
// ==========================================

function stopTimer() {

    if (timer) {

        clearInterval(timer);

        timer = null;
    }
}


// ==========================================
// TIMER DISPLAY
// ==========================================

function updateTimerDisplay() {

    const timerElement =
        document.getElementById("timer");

    if (!timerElement) return;


    const minutes =
        Math.floor(timeLeft / 60);

    const seconds =
        timeLeft % 60;


    timerElement.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");


    if (timeLeft <= 10) {

        timerElement.classList.add(
            "danger"
        );

    } else {

        timerElement.classList.remove(
            "danger"
        );
    }
}


// ==========================================
// ANALYTICS
// ==========================================

function updateAnalytics() {

    let answered = 0;
    let skippedCount = 0;
    let correct = 0;


    for (
        let i = 0;
        i < quizQuestions.length;
        i++
    ) {

        if (
            answers[i] !== null &&
            answers[i] !== undefined
        ) {

            answered++;

            if (
                isCorrect(
                    quizQuestions[i],
                    answers[i]
                )
            ) {

                correct++;
            }
        }


        if (skipped[i]) {

            skippedCount++;
        }
    }


    const wrong =
        answered - correct;


    setText(
        "sideQuestion",
        (currentQuestion + 1) +
        " / " +
        quizQuestions.length
    );


    setText(
        "answeredCount",
        answered
    );


    setText(
        "correctCount",
        correct
    );


    setText(
        "wrongCount",
        wrong
    );


    setText(
        "skippedCount",
        skippedCount
    );


    const used =
        getTotalUsedTime();


    setText(
        "timeUsed",
        formatTime(used)
    );
}


// ==========================================
// CHECK ANSWER
// ==========================================

function isCorrect(question, answer) {

    if (answer === null ||
        answer === undefined) {

        return false;
    }


    let correct =
        question.correctAnswer;


    if (correct === undefined) {

        correct =
            question.correct;
    }


    if (correct === undefined) {

        correct =
            question.answer;
    }


    if (typeof correct === "number") {

        return answer === correct;
    }


    if (typeof correct === "string") {

        const options =
            question.options ||
            question.answers ||
            [];


        // If correct answer is text
        if (
            options[answer] === correct
        ) {

            return true;
        }


        // If correct answer is A/B/C/D
        const letters =
            ["A", "B", "C", "D"];


        if (
            letters[answer] ===
            correct.toUpperCase()
        ) {

            return true;
        }


        // If correct answer is "0", "1", etc.
        if (
            Number(correct) === answer
        ) {

            return true;
        }
    }


    return false;
}


// ==========================================
// FINISH QUIZ
// ==========================================

function finishQuiz() {

    stopTimer();

    totalTimeUsed =
        getTotalUsedTime();


    let correct = 0;
    let answered = 0;
    let skippedCount = 0;


    quizQuestions.forEach(
        function(question, index) {

            if (
                answers[index] !== null &&
                answers[index] !== undefined
            ) {

                answered++;

                if (
                    isCorrect(
                        question,
                        answers[index]
                    )
                ) {

                    correct++;
                }
            }


            if (skipped[index]) {

                skippedCount++;
            }

        }
    );


    const wrong =
        answered - correct;


    const total =
        quizQuestions.length;


    const percentage =
        total > 0
            ? Math.round(
                (correct / total) * 100
              )
            : 0;


    // Show result
    document.getElementById(
        "quizScreen"
    ).classList.remove("active");


    document.getElementById(
        "resultScreen"
    ).classList.add("active");


    setText(
        "finalMarks",
        correct + " / " + total
    );


    setText(
        "finalCorrect",
        correct
    );


    setText(
        "finalWrong",
        wrong
    );


    setText(
        "finalSkipped",
        skippedCount
    );


    setText(
        "finalTime",
        formatTime(totalTimeUsed)
    );


    const minutes =
        totalTimeUsed / 60;


    const qpm =
        minutes > 0
            ? (total / minutes).toFixed(2)
            : total.toFixed(2);


    setText(
        "questionsPerMinute",
        qpm
    );


    setText(
        "resultPercent",
        percentage + "%"
    );


    // Result level
    let emoji = "🔴";
    let message = "Keep Practicing!";


    if (correct >= 11) {

        emoji = "🟢";
        message = "Excellent!";

    } else if (correct >= 7) {

        emoji = "🟡";
        message = "Good Job!";

    } else if (correct >= 4) {

        emoji = "🟠";
        message = "Nice Try!";

    } else {

        emoji = "🔴";
        message = "Keep Practicing!";
    }


    setText(
        "resultLevel",
        emoji
    );


    setText(
        "resultMessage",
        message
    );


    localStorage.removeItem(
        "mcqQuizData"
    );
}


// ==========================================
// TOTAL TIME
// ==========================================

function getTotalUsedTime() {

    let used = totalTimeUsed;


    if (quizStartTime) {

        used =
            Math.floor(
                (Date.now() -
                    quizStartTime) / 1000
            );
    }


    return Math.max(0, used);
}


// ==========================================
// FORMAT TIME
// ==========================================

function formatTime(seconds) {

    seconds =
        Math.max(
            0,
            Math.floor(seconds)
        );


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
// SET TEXT HELPER
// ==========================================

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value;
    }
}


// ==========================================
// WHEN test.html OPENS
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const isQuizPage =
            document.getElementById(
                "quizScreen"
            );


        if (!isQuizPage) {

            return;
        }


        if (!loadQuizData()) {

            alert(
                "Quiz data not found.\n" +
                "Please choose Subject and Class first."
            );

            return;
        }


        document.getElementById(
            "subjectScreen"
        ).classList.remove("active");


        document.getElementById(
            "classScreen"
        ).classList.remove("active");


        document.getElementById(
            "resultScreen"
        ).classList.remove("active");


        document.getElementById(
            "quizScreen"
        ).classList.add("active");


        showQuestion();

    }
);


// ==========================================
// SAVE BEFORE LEAVING
// ==========================================

window.addEventListener(
    "beforeunload",
    function() {

        saveQuizData();

    }
);
