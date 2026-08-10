// questions.js
// ==========================================
// MCQ QUESTION DATABASE
// ==========================================

// GENERAL SCIENCE
const generalScienceQuestions = {
  "9th": [
    {
      question: "Which is the basic unit of life?",
      options: ["Atom", "Cell", "Tissue", "Organ"],
      answer: 1
    },
    {
      question: "Which gas is most abundant in Earth's atmosphere?",
      options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
      answer: 2
    }
  ],

  "10th": [
    {
      question: "What is the chemical formula of water?",
      options: ["CO2", "H2O", "O2", "NaCl"],
      answer: 1
    }
  ],

  "11th": [
    {
      question: "What is the SI unit of force?",
      options: ["Joule", "Newton", "Watt", "Pascal"],
      answer: 1
    }
  ],

  "12th": [
    {
      question: "What is the SI unit of electric current?",
      options: ["Volt", "Ohm", "Ampere", "Watt"],
      answer: 2
    }
  ]
};


// MATHEMATICS
const mathematicsQuestions = {
  "9th": [
    {
      question: "What is 12 + 18?",
      options: ["20", "25", "30", "35"],
      answer: 2
    }
  ],

  "10th": [
    {
      question: "What is the value of 15 × 4?",
      options: ["45", "50", "60", "75"],
      answer: 2
    }
  ],

  "11th": [
    {
      question: "What is the derivative of x²?",
      options: ["x", "2x", "x²", "2"],
      answer: 1
    }
  ],

  "12th": [
    {
      question: "What is the derivative of sin(x)?",
      options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],
      answer: 0
    }
  ]
};


// SOCIAL SCIENCE
const socialScienceQuestions = {
  "9th": [
    {
      question: "What is democracy?",
      options: [
        "Rule by one person",
        "Rule by the people",
        "Rule by the army",
        "Rule by a king"
      ],
      answer: 1
    }
  ],

  "10th": [
    {
      question: "Which is the largest democracy in the world?",
      options: ["India", "USA", "China", "Japan"],
      answer: 0
    }
  ],

  "11th": [
    {
      question: "What is the study of production and consumption called?",
      options: ["History", "Economics", "Geography", "Civics"],
      answer: 1
    }
  ],

  "12th": [
    {
      question: "What does GDP stand for?",
      options: [
        "Gross Domestic Product",
        "General Domestic Price",
        "Gross Development Plan",
        "Government Development Product"
      ],
      answer: 0
    }
  ]
};


// ENGLISH
const englishQuestions = {
  "9th": [
    {
      question: "Choose the correct plural of 'child'.",
      options: ["Childs", "Childes", "Children", "Childrens"],
      answer: 2
    }
  ],

  "10th": [
    {
      question: "Choose the correct past tense of 'go'.",
      options: ["Goed", "Gone", "Went", "Going"],
      answer: 2
    }
  ],

  "11th": [
    {
      question: "Which word is a noun?",
      options: ["Beautiful", "Quickly", "Teacher", "Run"],
      answer: 2
    }
  ],

  "12th": [
    {
      question: "Which sentence is grammatically correct?",
      options: [
        "He go to school.",
        "He goes to school.",
        "He going school.",
        "He gone school."
      ],
      answer: 1
    }
  ]
};


// ==========================================
// GET QUESTIONS BY SUBJECT + CLASS
// ==========================================

function getQuestions(subject, className) {

  if (subject === "General Science") {
    return generalScienceQuestions[className] || [];
  }

  if (subject === "Mathematics") {
    return mathematicsQuestions[className] || [];
  }

  if (subject === "Social Science") {
    return socialScienceQuestions[className] || [];
  }

  if (subject === "English") {
    return englishQuestions[className] || [];
  }

  // ALL SUBJECTS
  if (subject === "ALL") {

    return [
      ...(generalScienceQuestions[className] || []),
      ...(mathematicsQuestions[className] || []),
      ...(socialScienceQuestions[className] || []),
      ...(englishQuestions[className] || [])
    ];
  }

  return [];
}


// ==========================================
// SHUFFLE QUESTIONS
// ==========================================

function shuffleQuestions(array) {

  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] =
      [shuffled[j], shuffled[i]];
  }

  return shuffled;
}


// ==========================================
// RANDOM MATHEMATICS QUESTION GENERATOR
// ==========================================

// Example:
// X - Z = Y
// X and Z are random numbers
// Y is calculated automatically.

function generateRandomMathQuestion() {

  const x = Math.floor(Math.random() * 100) + 1;
  const z = Math.floor(Math.random() * 100) + 1;

  const y = x - z;

  const correctAnswer = y;

  const options = [
    correctAnswer,
    correctAnswer + Math.floor(Math.random() * 10) + 1,
    correctAnswer - Math.floor(Math.random() * 10) - 1,
    correctAnswer + Math.floor(Math.random() * 20) + 10
  ];

  const shuffledOptions = shuffleQuestions(options);

  return {
    question: `${x} - ${z} = ?`,
    options: shuffledOptions,
    answer: shuffledOptions.indexOf(correctAnswer)
  };
}


// ==========================================
// GENERATE MANY RANDOM MATH QUESTIONS
// ==========================================

function generateMathQuestions(amount = 50) {

  const questions = [];

  for (let i = 0; i < amount; i++) {
    questions.push(generateRandomMathQuestion());
  }

  return questions;
}
