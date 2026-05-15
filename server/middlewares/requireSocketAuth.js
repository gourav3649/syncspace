const jwt = require("jsonwebtoken");

const config = process.env;

const requireSocketAuth = (socket, next) => {
    let token = socket.handshake.auth?.token;

    if (!token) {
        return next(new Error("A token is required for authentication"));
    }
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        socket.user = decoded;
    } catch (err) {
        return next(new Error("403, Not authorized"));
    }

    return next();
};

module.exports = requireSocketAuth;
