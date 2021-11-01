require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const PORT = process.env.APP_PORT
const { generateAccessToken, generateRefreshToken, authTokenMiddleware } = require('./jwthelper')

//request body parsers middleware
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.urlencoded({ type: 'application/x-www-form-urlencoded' }))

//Just an example of payload
const allPosts = [
    {
        login: 'Serj',
        title: 'Awesome Node.js'
    },
    {
        login: 'Sviborg',
        title: 'Power of JWT =]'
    },
    {
        login: 'Jedi',
        title: 'Let force be with you [='
    }
]

app.get('/posts', authTokenMiddleware, (req, res) => {
    res.json(allPosts.filter(post => post.login === req.user.login))
})
// End of Just an example of payload

app.post('/login', (req, res) => {
    //TODO: Auth... if password === password from DB
    // const password = req.body.password

    const userLogin = req.body.login;
    if (userLogin == null || userLogin === '') {
        res.json({
            error: 'Error: Login can`t be empty!'
        })
        return false
    }

    const user = {
        login: userLogin
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
        accessToken: accessToken,
        refreshToken: refreshToken,
    });
})

app.listen(PORT, () => {
    console.log(`${(new Date()).toISOString()} -> Server started at port: ${PORT}`)
})