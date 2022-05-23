const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const usersModel = require("../models").User;
exports.getUsers = async (req, res) => {
  try {
    const users = await usersModel.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.createUser = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Length of the name should be atleast 3 characters")
    .isAlpha()
    .withMessage("Only alphabets are allowed"),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 3 })
    .withMessage("Length of the username should be atleast 3 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email id is required")
    .isLength({ min: 5 })
    .withMessage("Length of the email should be atleast 5 characters"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 5 })
    .withMessage("Length of the password should be atleast 5 characters"),
  async (req, res) => {
    const errors = validationResult("req");
    if (!errors.isEmpty()) {
      res.status(400).json({ result_message: errors });
    } else {
      const users = await usersModel.findAll();
      let flag = false;
      users.forEach((user) => {
        if (user.email === req.body.email) {
          flag = true;
        }
      });
      if (flag) {
        res.status(400).json({ result_message: "Email already exists" });
      } else {
        let encryptedPassword;
        try {
          let salt = bcrypt.genSaltSync(10);
          console.log(salt);
          encryptedPassword = bcrypt.hashSync(req.body.password, salt);
          console.log(encryptedPassword);
        } catch (err) {
          console.log("Error in bcrypt");
        }
        try {
          const user = await usersModel.create({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: encryptedPassword,
          });
          res.status(200).json({ result_message: "User created" });
        } catch (err) {
          res.status(500).json(err);
        }
      }
    }
  },
];
exports.loginUser = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email Id is required")
    .isLength({ min: 5 })
    .withMessage("Length of the email should be atleast 5 characters"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 5 })
    .withMessage("Length of the password should be atleast 5 characters"),
  async (req, res) => {
    const errors = validationResult("req");
    if (!errors.isEmpty()) {
      res.status(400).json({ result_message: errors });
    } else {
      try {
        const { email, password } = req.body;
        const checkEmail = await usersModel.findOne({ where: { email } });
        if (checkEmail) {
          const checkPassword = await bcrypt.compareSync(
            password,
            checkEmail.password
          );
          if (checkPassword) {
            const payload = {
              email: email,
              password: password,
            };
            const token = jwt.sign(payload, "secret_string", {
              expiresIn: 1200,
            });
            res.status(200).json({ token, payload });
          } else {
            res.status(400).json({ result_message: "Invalid Password" });
          }
        } else {
          res.status(400).json({ result_message: "Invalid Email" });
        }
      } catch (err) {
        res.status(500).json(`Internal server error occured-${err}`);
      }
    }
  },
];
