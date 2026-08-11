// questions-math.js
// ==========================================
// RANDOM MATHEMATICS QUESTION GENERATOR
// ==========================================

// Shuffle function
function shuffleMathOptions(array) {
const result = [...array];

for (let i = result.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1));

[result[i], result[j]] = [result[j], result[i]];

}

return result;
}

// ==========================================
// RANDOM ADDITION
// ==========================================

function generateAdditionQuestion() {

const x = Math.floor(Math.random() * 1000) + 1;
const z = Math.floor(Math.random() * 1000) + 1;

const y = x + z;

return createMathQuestion(
"${x} + ${z} = ?",
y
);
}

// ==========================================
// RANDOM SUBTRACTION
// ==========================================

function generateSubtractionQuestion() {

const x = Math.floor(Math.random() * 1000) + 1;
const z = Math.floor(Math.random() * x) + 1;

const y = x - z;

return createMathQuestion(
"${x} - ${z} = ?",
y
);
}

// ==========================================
// RANDOM MULTIPLICATION
// ==========================================

function generateMultiplicationQuestion() {

const x = Math.floor(Math.random() * 100) + 1;
const z = Math.floor(Math.random() * 100) + 1;

const y = x * z;

return createMathQuestion(
"${x} × ${z} = ?",
y
);
}

// ==========================================
// RANDOM DIVISION
// ==========================================

function generateDivisionQuestion() {

const z = Math.floor(Math.random() * 50) + 1;
const y = Math.floor(Math.random() * 50) + 1;

const x = z * y;

return createMathQuestion(
"${x} ÷ ${z} = ?",
y
);
}

// ==========================================
// CREATE MCQ
// ==========================================

function createMathQuestion(questionText, correctAnswer) {

const wrong1 = correctAnswer + randomDifference();
const wrong2 = correctAnswer - randomDifference();
const wrong3 = correctAnswer + randomDifference();

let options = [
correctAnswer,
wrong1,
wrong2,
wrong3
];

// Remove duplicate options
options = [...new Set(options)];

// Make sure there are 4 options
while (options.length < 4) {

const newOption =
  correctAnswer + randomDifference();

if (!options.includes(newOption)) {
  options.push(newOption);
}

}

options = shuffleMathOptions(options);

return {
question: questionText,
options: options,
answer: options.indexOf(correctAnswer)
};
}

// ==========================================
// RANDOM DIFFERENCE
// ==========================================

function randomDifference() {

return Math.floor(Math.random() * 20) + 1;
}

// ==========================================
// GENERATE ONE RANDOM MATH QUESTION
// ==========================================

function generateRandomMathQuestion() {

const type = Math.floor(Math.random() * 4);

if (type === 0) {
return generateAdditionQuestion();
}

if (type === 1) {
return generateSubtractionQuestion();
}

if (type === 2) {
return generateMultiplicationQuestion();
}

return generateDivisionQuestion();
}

// ==========================================
// GENERATE 50 RANDOM QUESTIONS
// ==========================================

function generateMathQuestions(amount = 50) {

const questions = [];

for (let i = 0; i < amount; i++) {

questions.push(
  generateRandomMathQuestion()
);

}

return questions;
}
