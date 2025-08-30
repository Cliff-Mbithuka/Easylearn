const axios = require('axios');
const logger = require('winston');

const generateQuestion = async () => {
    const randomSeed = Math.floor(Math.random() * 1000) + 1;
    const num1 = Math.floor(Math.random() * 401) + 100; // 100 to 500
    const num2 = Math.floor(Math.random() * 151) + 50;  // 50 to 200
    const operation = Math.random() < 0.5 ? '+' : '-';
    const expression = `${num1} ${operation} ${num2}`;

    const contexts = [
        `A farmer has ${num1} mangoes and ${operation === '+' ? 'adds' : 'sells'} ${num2}. How many mangoes are left?`,
        `A shopkeeper buys ${num1} pencils and ${operation === '+' ? 'buys more' : 'gives away'} ${num2}. How many pencils remain?`,
        `A student travels ${num1} km and then ${operation === '+' ? 'continues for' : 'returns'} ${num2} km. What is the total distance?`,
        `A school has ${num1} books and ${operation === '+' ? 'receives' : 'donates'} ${num2}. How many books are there now?`
    ];
    const questionText = contexts[Math.floor(Math.random() * contexts.length)];

    try {
        const encodedExpr = encodeURIComponent(expression);
        const response = await axios.get(`http://api.mathjs.org/v4/?expr=${encodedExpr}`);
        const correctAnswer = String(response.data);

        const options = [correctAnswer];
        const offsets = [-10, 10, 20, -20, 30, -30];
        offsets.sort(() => Math.random() - 0.5);
        for (let i = 0; i < 3; i++) {
            options.push(String(Number(correctAnswer) + offsets[i]));
        }
        options.sort(() => Math.random() - 0.5);

        return {
            question: questionText,
            options,
            correct: correctAnswer
        };
    } catch (error) {
        logger.error(`Error generating question: ${error.message}`);
        return {
            question: "What is 300 + 200?",
            options: ["400", "500", "600", "700"],
            correct: "500"
        };
    }
};

const generateUniqueSessionQuestions = async (numQuestions = 5) => {
    const sessionQuestions = [];
    const questionTexts = new Set();
    let maxRetries = 10;

    while (sessionQuestions.length < numQuestions && maxRetries > 0) {
        const question = await generateQuestion();
        if (!questionTexts.has(question.question)) {
            questionTexts.add(question.question);
            sessionQuestions.push(question);
        } else {
            logger.debug(`Duplicate question detected: ${question.question}, regenerating...`);
            maxRetries--;
        }
    }

    if (sessionQuestions.length < numQuestions) {
        logger.warn(`Could only generate ${sessionQuestions.length} unique questions`);
        while (sessionQuestions.length < numQuestions) {
            const num = 300 + sessionQuestions.length * 100;
            sessionQuestions.push({
                question: `What is ${num} + 200?`,
                options: [String(num + 100), String(num + 200), String(num + 300), String(num + 400)],
                correct: String(num + 200)
            });
            questionTexts.add(sessionQuestions[sessionQuestions.length - 1].question);
        }
    }

    return sessionQuestions;
};

const evaluateAnswer = (questionData, userAnswer) => {
    const optionMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
    const selectedOption = optionMap[userAnswer] !== undefined ? questionData.options[optionMap[userAnswer]] : null;

    if (selectedOption === questionData.correct) {
        return { is_correct: true, feedback: "Correct!" };
    } else {
        const feedback = `Incorrect. The correct answer is ${questionData.correct}.`;
        return { is_correct: false, feedback: feedback.slice(0, 100) };
    }
};

module.exports = { generateQuestion, generateUniqueSessionQuestions, evaluateAnswer };