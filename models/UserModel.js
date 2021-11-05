const uuid = require("uuid");
const Model = require("./model");

module.exports = class UserModel extends Model {

    tableName = 'users';

    createTable() {
        let sql = `CREATE TABLE users (
                \tuid varchar(36) NOT NULL,
                \tlogin varchar(255) NULL,
                \temail varchar(255) NOT NULL,
                \tlast_ip varchar(40) NULL,
                \tfirst_name varchar(255) NULL,
                \tlast_name varchar(255) NULL,
                \tpassword varchar(255) NOT NULL,
                \trefresh_token TEXT NULL
            )
            ENGINE=InnoDB
            DEFAULT CHARSET=utf8mb4
            COLLATE=utf8mb4_general_ci;
            CREATE INDEX users_uid_IDX USING BTREE ON nodejs_jwt_auth.users (uid,email);
            CREATE UNIQUE INDEX users_email_IDX USING BTREE ON nodejs_jwt_auth.users (email);
            CREATE INDEX users_last_ip_IDX USING BTREE ON nodejs_jwt_auth.users (last_ip);
            CREATE INDEX users_password_IDX USING BTREE ON nodejs_jwt_auth.users (password,email);
            CREATE FULLTEXT INDEX users_refresh_token_IDX ON nodejs_jwt_auth.users (refresh_token);
        `;

        return this.q(sql);
    }

    addUser(user) {
        let sql = `INSERT INTO users
            (uid, login, email, last_ip, first_name, last_name, password, refresh_token)
            VALUES('${uuid.v5()}', '', '${user.email}', '${user.last_ip}', '${user.first_name}', '${user.last_name}', '${user.password}', '${user.refresh_token}');
        `
        return this.q(sql);
    }

    editUser(uid, user) {
        let sql = `UPDATE users SET 
            (uid, login, email, last_ip, first_name, last_name, refresh_token)
            VALUES('${uuid.v5()}', '', '${user.email}', '${user.last_ip}', '${user.first_name}', '${user.last_name}', '${user.refresh_token}');
        `
        return this.q(sql);
    }

    updateRefreshToken(uid, refreshToken) {
        let sql = `INSERT INTO users u
            SET u.refresh_token = '${refreshToken}'
            WHERE u.uid = '${uid}';
        `
        return this.q(sql)
    }

    updatePassword(uid, value) {
        let sql = `INSERT INTO users u
            SET u.password = '${value}'
            WHERE u.uid = '${uid}';
        `
        return this.q(sql)
    }

    checkLogin(email, password) {
        let sql = `SELECT * FROM ${this.tableName} WHERE password = '${password}' AND email = '${email}'`
        // let result =  this.q(sql)
        this.connection.query(sql, function(err, rows, fields) {
            if (err) throw err;
            console.log(rows)
            return rows
        })
    }

    getUserById(uid) {
        let sql = `SELECT * FROM ${this.tableName} WHERE uid = ${uid}`
        return this.q(sql)
    }

    drop() {
        let sql = `DROP TABLE IF EXISTS ${this.tableName}`
    }

    constructor(connection) {
        super()
        this.init(connection)
    }

}