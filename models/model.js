const {connection} = require("../database");
module.exports = class Model {

    q(sql) {
        let result = false;

        if (connection.state === 'disconnected') {
            connection.connect()
        }
        this.connection.query(sql, (err, data) => {
            if (err) console.error(err);
            result = data;
        });
        return result;
    }

    init(connection) {
        /**
         * @var connection
         */
        this.connection = connection;
        this.DATABASE = process.env.DB_DATABASE ?? ''
    }
}