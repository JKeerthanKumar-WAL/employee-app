const jwt = require("jsonwebtoken");
module.exports = async (req, res, next) => {
  const token = await req.header("token");
  if (!token) {
    res.status(404).json({ status: 0, debug_msg: "Token not found" });
  }
  try {
    const decodedToken = jwt.verify(token, "secret_string");
    console.log(decodedToken);
    next();
  } catch (err) {
    res.status(400).json({ status: 0, debug_msg: "Token sent is not valid" });
  }
};
