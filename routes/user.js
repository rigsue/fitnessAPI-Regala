const express = require('express');
const userController = require('../controllers/userController');
const { verify } = require("../middleware/auth");

const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/details", verify, userController.retrieveDetails);

module.exports = router;