const axios = require('axios');
const logger = require('winston');

const GEMINI_API_KEY = 'AIzaSyBKi8uNdAWP0-u15J_lRzW4A4YMozRW7tc';

const generateQuestion = async () => {
    const randomSeed = Math.floor(Math.random() * 1000) + 1;
    const prompt = `Generate a unique Grade 4 Math question (Kenyan curriculum, addition/subtraction). ` +
                   `Use a varied context (e.g., shopping, farming, travel, school) and ensure the question is distinct (seed: ${randomSeed}). ` +
                   `Provide a multiple-choice question with 4 options and correct answer. ` +
                   `Format: Question|OptionA|OptionB|OptionC|OptionD|Correct`;

    try {
        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
            {
                contents: [
                    {
                        parts: [
                            { text: prompt }
                        ]
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-goog-api-key': GEMINI_API_KEY
                }
            }
        );

        const responseText = response.data.candidates[0].content.parts[0].text.trim();
        logger.debug(`Raw API response: ${responseText}`);

        const parts = responseText.split('|');
        if (parts.length !== 6 || parts.some(p => !p)) {
            logger.error(`Invalid response format: ${responseText}`);
            return {
                question: "What is 300 + 200?",
                options: ["400", "500", "600", "700"],
                correct: "500"
            };
        }

        const [question, a, b, c, d, correct] = parts;
        return {
            question,
            options: [a, b, c, d],
            correct
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