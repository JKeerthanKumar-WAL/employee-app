const jwt = require("jsonwebtoken");
module.exports = async (req, res, next) => {
  const token = await req.header("token");
  if (!token) {
    res.status(404).json({ result_message: "Token not found" });
  }
  try {
    const decodedToken = jwt.verify(token, "secret_string");
    console.log(decodedToken);
    next();
  } catch (err) {
    res.status(400).json({ result_message: "Token sent is not valid" });
  }
};
