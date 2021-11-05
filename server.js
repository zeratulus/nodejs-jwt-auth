require('dotenv').config()

const express = require('express')
const {connection} = require('./database')
const bodyParser = require('body-parser')
const csurf = require('csurf')
const app = express()
//register body parsers middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

const routes = require('./routes');
const PORT = process.env.APP_PORT ?? 5000;

//routing
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`${(new Date()).toISOString()} -> Server started at port: ${PORT}`)
})

// connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
//     if (err) throw err;
//     console.log('DB:Ok - The solution of 1 + 1 is: ', rows[0].solution)
// });
//
connection.query(`SELECT * FROM users WHERE password = 'pass' AND email = 'testmailxxx@gmail.com'`, function(err, rows, fields) {
    if (err) throw err;
    console.log('DB:Ok - The solution of 1 + 1 is: ', rows)
});

//some shutdown routine
process.on('SIGTERM', () => {
    console.debug(`${(new Date()).toISOString()} -> Shutting Down...`)
    connection.end()
    app.close(() => {
        console.debug(`${(new Date()).toISOString()} -> Good bye =]`)
    })
})