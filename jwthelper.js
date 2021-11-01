const jwt = require('jsonwebtoken')

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
}

function generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}

function authTokenMiddleware(req, res, next) {
    const authHeaders = req.headers['authorization']
    const token = authHeaders && authHeaders.split(' ')[1] //Bearer TOKEN_HERE
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {},(err, user) => {
        if (err) return res.status(401).json(err)
        req.user = user
        next()
    })
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    authTokenMiddleware,
}