const express = require('express');
const {authTokenMiddleware, generateAccessToken, generateRefreshToken} = require("./jwthelper");
const jwt = require("jsonwebtoken");
const { v5: uuidv5 } = require('uuid');
const {hashPassword} = require("mysql/lib/protocol/Auth");
const UserModel = require("./models/UserModel");
const {connection} = require("./database");
const router = express.Router();

const userModel = new UserModel(connection);

//TODO: move
function validateEmailAndPassword(req, res, isRegister = false) {
    let email = req.body.email
    if (email == null || typeof email === 'undefined') {
        console.log(email);
        res.json({
            error: 'Error: E-mail can`t be empty!'
        })
        return false
    }
    // if (email.match('mail regex'))

    let password = req.body.password
    if (password === null || typeof password === 'undefined') res.json({
        error: 'Error: Empty password!'
    })

    let password_confirm = password
    if (isRegister) {
        password_confirm = req.body.password_confirm
    }
    if ((password = String(password).trim()) !== String(password_confirm).trim() && password.length <= 0) {
        res.json({
            error: 'Error: Provided passwords are not equal!'
        })
        return false
    }
    return {email, password}
}

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

router.post('/register', (req, res) => {
    let first_name = req.body.first_name
    let last_name = req.body.last_name

    let {email, password} = validateEmailAndPassword(req, res, true);
    let uid = uuidv5();
    const refreshToken = generateRefreshToken({uid})
    refreshTokensList.push(refreshToken)

    const user = {
        uid: uid,
        email: connection.escape(email),
        last_ip: connection.escape(req.ip),
        first_name: connection.escape(first_name),
        last_name: connection.escape(last_name),
        password: hashPassword(password),
        refresh_token: refreshToken
    }

    try {
        userModel.addUser(user);
    } catch (e) {
        console.error(e.toString())
    }

    const accessToken = generateAccessToken({uid})

    res.json({
        accessToken: accessToken,
        refreshToken: refreshToken,
    });
})

router.post('/login', (req, res) => {

    let {email, password} = validateEmailAndPassword(req, res)
    let user = userModel.checkLogin(email, password)
    if (user === null) {
        // const accessToken = generateAccessToken({user.uid})
        // const refreshToken = generateRefreshToken({user.uid})
        // refreshTokensList.push(refreshToken)
        // userModel.updateRefreshToken(user[0].uid, refreshToken)

        res.json({
            success: true
            // accessToken: accessToken,
            // refreshToken: refreshToken,
        });
    } else {
        res.json({
            error: 'Error: Please register or contact system administrator!'
        });
    }
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