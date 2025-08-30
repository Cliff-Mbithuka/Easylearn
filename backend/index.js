const express = require('express');
const bodyParser = require('body-parser');
const AfricasTalking = require('africastalking');
const dotenv = require('dotenv');
const logger = require('winston');
const ussdController = require('./controllers/ussdController');
const webController = require('./controllers/webController');
const dbController = require('./controllers/dbController');
const readline = require('readline');

// Load environment variables
dotenv.config();

// Configure logging
logger.configure({
    transports: [
        new logger.transports.Console({ level: 'debug' })
    ]
});

// Africa's Talking initialization
const africasTalking = AfricasTalking({
    username: process.env.AT_USERNAME,
    apiKey: process.env.AT_API_KEY
});
const sms = africasTalking.SMS;

// Initialize database
dbController.initDb();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.post('/ussd', ussdController.handleUssd);
app.get('/web', webController.handleWebGet);
app.post('/web', webController.handleWebPost);

// Command-line interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    console.log("Welcome to LearnEasy! Enter your phone number to start (e.g., test123):");
    const phone = await new Promise(resolve => rl.question('', resolve));

    let user = await dbController.getUser(phone);
    if (!user) {
        await dbController.createUser(phone, 4, 'Math');
        user = { phone, grade: 4, subject: 'Math', points: 0, lives: 3, current_question: 0, session_questions: '[]' };
    }

    let { grade, subject, points, lives, current_question, session_questions } = user;
    session_questions = JSON.parse(session_questions);

    while (true) {
        console.log("\nMenu: 1) Start Math  2) View Points  3) Exit");
        const choice = await new Promise(resolve => rl.question('Enter choice (1-3): ', resolve));

        if (choice === '1') {
            if (!session_questions.length) {
                session_questions = await ussdController.generateUniqueSessionQuestions(5);
                lives = 3;
                current_question = 0;
                await dbController.updateUser(phone, points, lives, current_question, JSON.stringify(session_questions));
            }

            while (current_question < session_questions.length && lives > 0) {
                const question = session_questions[current_question];
                console.log(`\nQ${current_question + 1}: ${question.question}`);
                console.log(`A) ${question.options[0]}  B) ${question.options[1]}`);
                console.log(`C) ${question.options[2]}  D) ${question.options[3]}`);
                const user_answer = (await new Promise(resolve => rl.question('Enter answer (A, B, C, D): ', resolve))).toUpperCase();

                if (!['A', 'B', 'C', 'D'].includes(user_answer)) {
                    console.log("Invalid answer! Please enter A, B, C, or D.");
                    continue;
                }

                const result = ussdController.evaluateAnswer(question, user_answer);
                if (result.is_correct) {
                    points += 10;
                    console.log("Correct! +10 points.");
                } else {
                    lives -= 1;
                    console.log(`Incorrect. ${result.feedback}`);
                    console.log(`Lives remaining: ${lives}`);
                }

                current_question += 1;
                await dbController.updateUser(phone, points, lives, current_question, JSON.stringify(session_questions));

                if (lives === 0) {
                    console.log(`Game Over! Final Score: ${points}`);
                    await dbController.updateUser(phone, points, lives, 0, '[]');
                    break;
                } else if (current_question >= session_questions.length) {
                    console.log(`Session Complete! Final Score: ${points}`);
                    await dbController.updateUser(phone, points, lives, 0, '[]');
                    break;
                }
            }
        } else if (choice === '2') {
            console.log(`Your Points: ${points}`);
        } else if (choice === '3') {
            console.log("Thank you for using LearnEasy!");
            break;
        } else {
            console.log("Invalid choice! Please enter 1, 2, or 3.");
        }
    }

    rl.close();
}

// Start server and CLI
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    main();
});