const { func } = require("joi");
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  console.log("verify token");
  const authHeader = req.headers.token;
  console.log(authHeader);
  if (!authHeader) return res.status(401).send("you are not Authedicated");
  else {
    const token = authHeader;
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) res.status(403).send("Token is not valid");
      req.user = user;
      next(); //calling verify tekens next call back statements
    });
  }
}

function verifyTokenAndAuthorization(req, res, next) {
  console.log("authorization");
}

function verifyTokenAndAdmin(req, res, next) {
  console.log("Admin ?");
  verifyToken(req, res, () => {
    console.log(req.user);
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).send("you are not allowed to do manipulation...");
    }
  });
}

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
