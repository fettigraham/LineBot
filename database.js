const mysql = require('mysql');

// Create a MySQL connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '', // Replace 'your_password' with your actual MySQL root password
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
      if (err) return reject(err);
      if (results.length > 0) {
        resolve(results[0].state);
      } else {
        resolve(null);
      }
    });
  });
}

// Function to get the current order from the database
function getCurrentOrder(userId) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT currentOrder FROM Users WHERE user_id = ?';
    db.query(sql, [userId], (err, results) => {
      if (err) return reject(err);
      if (results.length > 0 && results[0].currentOrder) {
        resolve(JSON.parse(results[0].currentOrder));
      } else {
        resolve(null);
      }
    });
  });
}

// Function to add an item to the currentOrder
function addToOrder(userId, item, quantity) {
  return getCurrentOrder(userId)
    .then(currentOrder => {
      if (!currentOrder) {
        currentOrder = { items: [] };
      }
      currentOrder.items.push({ item, quantity });
      return updateUserOrder(userId, currentOrder);
    });
}

// Function to update currentOrder for a user
function updateUserOrder(userId, order) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE Users SET currentOrder = ? WHERE user_id = ?';
    db.query(sql, [JSON.stringify(order), userId], (err, result) => {
      if (err) return reject(err);
      console.log('User order updated');
      resolve(result);
    });
  });
}

// Function to save current order to Orders table
function saveCurrentOrder(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      const currentOrder = await getCurrentOrder(userId);
      if (!currentOrder) {
        return reject(new Error('No current order found for user.'));
      }

      const sql = 'INSERT INTO Orders (user_id, order_data) VALUES (?, ?)';
      db.query(sql, [userId, JSON.stringify(currentOrder)], (err, result) => {
        if (err) return reject(err);
        console.log('Order saved to Orders table');
        resolve(result);
      });
    } catch (err) {
      reject(err);
    }
  });
}

// Function to clear the currentOrder field in Users table
function clearCurrentOrder(userId) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE Users SET currentOrder = NULL WHERE user_id = ?';
    db.query(sql, [userId], (err, result) => {
      if (err) return reject(err);
      console.log('Current order cleared');
      resolve(result);
    });
  });
}

module.exports = { saveUserState, updateUserState , getUserState,
		    getCurrentOrder, updateUserOrder, saveCurrentOrder,
		    clearCurrentOrder, addToOrder};
