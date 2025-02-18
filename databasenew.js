const mysql = require('mysql');

// Create a MySQL connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'IamiitG1!1!', // Replace 'your_password' with your actual MySQL root password
  database: 'LineBotDB'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL connected...');
});

// Function to save user state
function saveUserState(userId, state) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO Users (user_id, state) VALUES (?, ?) ON DUPLICATE KEY UPDATE state = ?';
    db.query(sql, [userId, state, state], (err, result) => {
      if (err) return reject(err);
      console.log('User state saved');
      resolve(result);
    });
  });
}

// Function to update user state
function updateUserState(userId, state) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE Users SET state = ? WHERE user_id = ?';
    db.query(sql, [state, userId], (err, result) => {
      if (err) return reject(err);
      console.log('User state updated');
      resolve(result);
    });
  });
}

function getUserState(userId) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT state FROM Users WHERE user_id = ?';
    db.query(sql, [userId], (err, results) => {
/      if (err) return reject(err);
      if (results.length > 0) {
        resolve(results[0].state);
      } else {
        resolve(null);
      }
    });
  });
}

module.exports = { saveUserState, updateUserState , getUserState};
