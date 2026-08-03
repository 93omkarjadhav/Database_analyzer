const express = require("express");
const router = express.Router();

const { register, login, updateProfile, logout } = require("../controllers/authController");

router.post("/signup", register);
router.post("/login", login);
router.post("/logout", logout);
router.put("/profile", updateProfile);

module.exports = router;