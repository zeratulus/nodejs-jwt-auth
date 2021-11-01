const express = require('express');
const {authTokenMiddleware, generateAccessToken, generateRefreshToken} = require("./jwthelper");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.use(function log(req, res, next) {
    console.log(Date.now() + ` -> ${req.method}: ${req.url}`);
    next();
});

//Just an example of payload

//TODO: Add DB routine too
let refreshTokensList = [];

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

router.get('/posts', authTokenMiddleware, (req, res) => {
    res.json(allPosts.filter(post => post.login === req.user.login))
})
// End of Just an example of payload

router.post('/login', (req, res) => {
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

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)
    refreshTokensList.push(refreshToken)

    res.json({
        accessToken: accessToken,
        refreshToken: refreshToken,
    });
})

router.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken === null) res.status(403).json({error: 'Error: Token can`t be empty!'});
    if (!refreshTokensList.includes(refreshToken)) res.status(403).json({error: 'Error: Token does not exists, please login!'});
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, {}, (err, user) => {
        if (err) return res.status(403).json(err)
        const accessToken = generateAccessToken({login: user.login})
        res.json({accessToken: accessToken})
    })
})

module.exports = router;