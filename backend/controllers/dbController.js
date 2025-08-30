const sqlite3 = require('sqlite3').verbose();

const initDb = () => {
    const db = new sqlite3.Database('users.db');
    db.run(`CREATE TABLE IF NOT EXISTS users (
        phone TEXT PRIMARY KEY,
        grade INTEGER,
        subject TEXT,
        points INTEGER DEFAULT 0,
        lives INTEGER DEFAULT 3,
        current_question INTEGER DEFAULT 0,
        session_questions TEXT DEFAULT '[]'
    )`, (err) => {
        if (err) throw err;
        db.close();
    });
};

const getUser = async (phone) => {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('users.db');
        db.get('SELECT * FROM users WHERE phone = ?', [phone], (err, row) => {
            db.close();
            if (err) reject(err);
            resolve(row);
        });
    });
};

const createUser = async (phone, grade, subject) => {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('users.db');
        db.run('INSERT INTO users (phone, grade, subject) VALUES (?, ?, ?)', [phone, grade, subject], (err) => {
            db.close();
            if (err) reject(err);
            resolve();
        });
    });
};

const updateUser = async (phone, points, lives, current_question, session_questions) => {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('users.db');
        db.run('UPDATE users SET points = ?, lives = ?, current_question = ?, session_questions = ? WHERE phone = ?',
            [points, lives, current_question, session_questions, phone], (err) => {
                db.close();
                if (err) reject(err);
                resolve();
            });
    });
};

module.exports = { initDb, getUser, createUser, updateUser };