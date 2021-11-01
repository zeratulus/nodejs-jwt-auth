require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes');
const app = express()
const PORT = process.env.APP_PORT ?? 5000;

//register body parsers middleware
app.use(bodyParser.json({type: 'application/*+json'}))
app.use(bodyParser.urlencoded({extended: true}));

//routing
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`${(new Date()).toISOString()} -> Server started at port: ${PORT}`)
})