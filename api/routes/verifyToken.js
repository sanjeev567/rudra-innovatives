const jwt = require("jsonwebtoken");

// verifyToken
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) {
        return res.status(403).json("Invalid token !");
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated");
  }
};

const verifyAndAuthorize = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user._id === req.params.id) {
      next();
    } else {
      return res
        .status(403)
        .json("You are not authorize to do this operation.");
    }
  });
};

module.exports = { verifyToken, verifyAndAuthorize };
