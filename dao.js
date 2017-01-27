const mysql = require('mysql');

const dbHost = process.env.MYSQL_HOST;
const dbUser = process.env.MYSQL_USER;
const dbPwd = process.env.MYSQL_PASSWORD;
const db = process.env.MYSQL_DATABASE;

/**
 * Promise based Store interface
 * @class Dao
 * @param {Object} [iConnection] a possibly fake mysql Connection instance (for tests),  
 */
function Dao(iConnection) {
    const connection = iConnection || mysql.createConnection({
                                        host: dbHost, 
                                        user: dbUser,
                                        password: dbPwd,
                                        database: db });
    this.connection = connection;
}

/**
 * @return {Promise<String>} it resolves to a random adjective from the db
 */
Dao.prototype.getRandWord = function () {
    return new Promise((resolve, reject) => {
        this.connection.query('SELECT word FROM `' + db + '` ORDER BY RAND() LIMIT 1',
            (err, res, fields) => {
                // this.connection.end();
                if (err) return reject(err);
                return resolve(res[0].word);
            });
    });
};
/**
 * @param {String} word the word to insert into db
 * @return {Promise} it resolves when the 'INSERT INTO...' query is done!
 */
Dao.prototype.push = function (word) {
    return new Promise((resolve, reject) => {
        this.connection.query('INSERT INTO `' + db + '` SET ?', { word },
            (err, res) => {
                // this.connection.end();
                if (err) return reject(err);
                return resolve();
            });
    });
};
/**
 * This method should be called when all mysql calls are over!
 * @return {Promise} resolves only if close is successful
 */
Dao.prototype.close = function () {
    return new Promise((resolve, reject) => {
        this.connection.end(err => {
            if (err) return reject(err);
            return resolve();
        });
    })
}

module.exports = Dao;
