const mysql = require('mysql');

module.exports = class Mysql {
  static connect() {
    // establish connection
    const db = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      port: 3306,
      database: 'cumsdbms',
      connectTimeout: 10000,
    });
    // connect to database
    db.connect((err) => {
      if (err) {
        throw err;
      }
      console.log('Mysql Connected');
    });
    return db;
  }
};
