const dbController = require('./dbController');
const questionController = require('./questionController');

const handleWebGet = async (req, res) => {
    const phone = req.query.phone || 'default_user';
    let user = await dbController.getUser(phone);
    if (!user) {
        await dbController.createUser(phone, 4, 'Math');
        user = { phone, grade: 4, subject: 'Math', points: 0, lives: 3, current_question: 0, session_questions: '[]' };
    }

    let { points, lives, current_question, session_questions } = user;
    session_questions = JSON.parse(session_questions);

    if (!session_questions.length) {
        session_questions = await questionController.generateUniqueSessionQuestions(5);
        await dbController.updateUser(phone, points, 3, 0, JSON.stringify(session_questions));
    }

    const question = session_questions[current_question];
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>LearnEasy</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { font-size: 24px; }
            p { font-size: 16px; }
            form { margin-top: 20px; }
            input[type="radio"] { margin: 10px 0; }
            input[type="submit"] { padding: 10px; background: #28a745; color: white; border: none; cursor: pointer; }
            img { display: block; margin: 20px auto; max-width: 100%; height: auto; }
        </style>
    </head>
    <body>
        <h1>LearnEasy: Math Grade 4</h1>
        <p>Points: ${points} | Lives: ${lives}</p>
        <img src="https://t4.ftcdn.net/jpg/02/94/52/73/240_F_294527346_xk225Ec5cbgFNvVb5b8FZYTYNpst8X7w.jpg" alt="Gamification Cartoon">
        <h3>Q${current_question + 1}: ${question.question}</h3>
        <form method="POST" action="/web?phone=${phone}">
            <input type="radio" name="answer" value="A"> ${question.options[0]}<br>
            <input type="radio" name="answer" value="B"> ${question.options[1]}<br>
            <input type="radio" name="answer" value="C"> ${question.options[2]}<br>
            <input type="radio" name="answer" value="D"> ${question.options[3]}<br>
            <input type="submit" value="Submit">
        </form>
    </body>
    </html>
    `);
};

const handleWebPost = async (req, res) => {
    const phone = req.query.phone || 'default_user';
    const user_answer = req.body.answer;

    let user = await dbController.getUser(phone);
    if (!user) {
        await dbController.createUser(phone, 4, 'Math');
        user = { phone, grade: 4, subject: 'Math', points: 0, lives: 3, current_question: 0, session_questions: '[]' };
    }

    let { points, lives, current_question, session_questions } = user;
    session_questions = JSON.parse(session_questions);

    if (user_answer && session_questions.length) {
        const question = session_questions[current_question];
        const result = questionController.evaluateAnswer(question, user_answer);
        if (result.is_correct) {
            points += 10;
        } else {
            lives -= 1;
        }
        current_question += 1;

        if (lives === 0 || current_question >= session_questions.length) {
            await dbController.updateUser(phone, points, lives, 0, '[]');
            return res.send(`Game Over! Score: ${points} <a href='/web?phone=${phone}'>Play Again</a>`);
        }

        await dbController.updateUser(phone, points, lives, current_question, JSON.stringify(session_questions));
    }

    return handleWebGet(req, res);
};

module.exports = { handleWebGet, handleWebPost };