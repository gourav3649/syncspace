const jwt = require("jsonwebtoken");

const config = process.env;

const requireAuth = (req, res, next) => {
    let token = req.headers["authorization"] || (req.body && req.body.token) || (req.query && req.query.token);

    if (!token) {
        return res.status(401).send("Unauthorized. A token is required for authentication");
    }
    try {
        if (token.startsWith("Bearer ")) {
            token = token.split(" ")[1];
        }

        const decoded = jwt.verify(token, config.JWT_SECRET || process.env.JWT_SECRET || "supersecret");
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }

    return next();
};

module.exports = requireAuth;
