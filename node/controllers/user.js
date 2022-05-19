const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const usersModel = require("../models").User;
exports.getUsers = async (req, res) => {
  await usersModel.findAll().then(
    (users) => {
      res.status(200).json(users);
    },
    (err) => {
      res.status(500).json(err);
    }
  );
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
    await usersModel.findAll().then(
      (users) => {
        let flag = false;
        users.forEach((user) => {
          if (user.username === req.body.username) {
            flag = true;
          }
        });
        if (flag) {
          res
            .status(400)
            .json({ status: 0, debug_data: "username already exists" });
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
          usersModel
            .create({
              name: req.body.name,
              username: req.body.username,
              email: req.body.email,
              password: encryptedPassword,
            })
            .then(
              (user) => {
                res.status(200).json({ status: 1, data: "user created" });
              },
              (err) => {
                res.status(500).json(err);
              }
            );
        }
      },
      (err) => {
        res.status(500).json(err);
      }
    );
  },
];
exports.loginUser = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 3 })
    .withMessage("Length of the username should be atleast 3 characters"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 5 })
    .withMessage("Length of the password should be atleast 5 characters"),
  async (req, res) => {
    try {
      const { username, password } = req.body;
      const checkUsername = await usersModel.findOne({ where: { username } });
      if (checkUsername) {
        const checkPassword = await bcrypt.compareSync(
          password,
          checkUsername.password
        );
        if (checkPassword) {
          const payload = {
            username: username,
            password: password,
          };
          const token = jwt.sign(payload, "secret_string", { expiresIn: 1200 });
          res.status(200).json({ token, payload });
        } else {
          res.status(400).json({ debug_data: "Invalid Password" });
        }
      } else {
        res.status(400).json({ debug_data: "Invalid Username" });
      }
    } catch (err) {
      res.status(500).json({ debug_data: "Internal server error occured" });
    }
  },
];
