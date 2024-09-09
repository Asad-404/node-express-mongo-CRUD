import jwt from "jsonwebtoken";

const checkLogin = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const { userName, userId } = decode;
    req.userName = userName;
    req.userId = userId;
    next();
  } catch (err) {
    next("Authentication failed!!");
  }
};

export default checkLogin;
