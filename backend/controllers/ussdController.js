const AfricasTalking = require('africastalking');
const logger = require('winston');
const dbController = require('./dbController');
const questionController = require('./questionController');

const africasTalking = AfricasTalking({
    username: process.env.AT_USERNAME,
    apiKey: process.env.AT_API_KEY
});
const sms = africasTalking.SMS;

const handleUssd = async (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    if (!sessionId || !serviceCode || !phoneNumber) {
        return res.status(400).send("END Invalid request parameters");
    }

    let user = await dbController.getUser(phoneNumber);
    if (!user) {
        await dbController.createUser(phoneNumber, 4, 'Math');
        user = { phone: phoneNumber, grade: 4, subject: 'Math', points: 0, lives: 3, current_question: 0, session_questions: '[]' };
    }

    let { grade, subject, points, lives, current_question, session_questions } = user;
    session_questions = JSON.parse(session_questions);

    let response = "CON ";
    if (text === "") {
        response += "Welcome to LearnEasy! Reply:\n1) Start Math\n2) View Points\n3) Exit";
    } else if (text === "1") {
        if (!session_questions.length) {
            session_questions = await questionController.generateUniqueSessionQuestions(5);
            await dbController.updateUser(phoneNumber, points, 3, 0, JSON.stringify(session_questions));
        }
        const question = session_questions[current_question];
        response += `Q${current_question + 1}: ${question.question}\n` +
                    `A) ${question.options[0]}\nB) ${question.options[1]}\n` +
                    `C) ${question.options[2]}\nD) ${question.options[3]}\nReply with A, B, C, or D`;
    } else if (['A', 'B', 'C', 'D'].includes(text)) {
        if (!session_questions.length) {
            response = "END No active session. Start a new game with 1.";
        } else {
            const question = session_questions[current_question];
            const result = questionController.evaluateAnswer(question, text);
            if (result.is_correct) {
                points += 10;
                feedback = "Correct! +10 points.";
            } else {
                lives -= 1;
                feedback = result.feedback;
                if (lives === 0) {
                    await dbController.updateUser(phoneNumber, points, lives, 0, '[]');
                    try {
                        await sms.send({ message: `Game Over! Your score: ${points}. Dial USSD to play again!`, to: [phoneNumber] });
                        logger.debug('SMS sent');
                    } catch (error) {
                        logger.error(`Failed to send SMS: ${error.message}`);
                    }
                    response = `END Game Over! Score: ${points}\nDial again to play.`;
                    return res.status(200).type('text/plain').send(response);
                }
            }
            current_question += 1;
            if (current_question >= session_questions.length) {
                await dbController.updateUser(phoneNumber, points, lives, 0, '[]');
                try {
                    await sms.send({ message: `Session Complete! Your score: ${points}. Dial USSD to play again!`, to: [phoneNumber] });
                    logger.debug('SMS sent');
                } catch (error) {
                    logger.error(`Failed to send SMS: ${error.message}`);
                }
                response = `END Session complete! Score: ${points}\nDial again to play.`;
            } else {
                await dbController.updateUser(phoneNumber, points, lives, current_question, JSON.stringify(session_questions));
                const nextQuestion = session_questions[current_question];
                response += `${feedback}\nQ${current_question + 1}: ${nextQuestion.question}\n` +
                            `A) ${nextQuestion.options[0]}\nB) ${nextQuestion.options[1]}\n` +
                            `C) ${nextQuestion.options[2]}\nD) ${nextQuestion.options[3]}\nReply with A, B, C, or D`;
            }
        }
    } else if (text === "2") {
        response += `Your Points: ${points}\nReply:\n1) Start Math\n3) Exit`;
    } else if (text === "3") {
        response = "END Thank you for using LearnEasy!";
    } else {
        response = "END Invalid input. Try again.";
    }

    res.status(200).type('text/plain').send(response);
};

module.exports = { handleUssd, generateUniqueSessionQuestions: questionController.generateUniqueSessionQuestions, evaluateAnswer: questionController.evaluateAnswer };