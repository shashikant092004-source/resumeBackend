const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  loginUser,
} = require("../controllers/userController");

router.post("/users", createUser);
router.get("/users", getUsers);
router.post("/login", loginUser);

module.exports = router;
