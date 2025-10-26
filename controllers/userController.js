const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const auth = require('../middleware/auth');

const { errorHandler } = auth;

// User Registration

module.exports.registerUser = async (req, res) => {
	try {
		if (!req.body.email.includes("@")){
			return res.status(400).send({ error: "Email not valid" });
		}
		if (req.body.password.length <8){
			return res.status(400).send({ error: "Password must be atleast 8 characters"});
		}

		let newUser = new User({
			email : req.body.email,
			password : bcrypt.hashSync(req.body.password, 10)
		});
		await newUser.save();
		return res.status(201).send({ message: "Registered Successfully" });
	} catch (error) {
		console.error(error);

		if (error.name == "ValidationError") {
			return res.status(400).send({ message: error.message });
		}
		return res.status(500).send({ message: "Server error" });
	}
}

// User Authentication

module.exports.loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !email.includes("@")) {
			return res.status(400).send({ error: "Invalid Email" });
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).send({ error: "No Email found" });
		}
		const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
		if (!isPasswordCorrect) {
			return res.status(401).send({ error: "Email and password do not match" });
		}
		const accessToken = auth.createAccessToken(user);
		return res.status(200).send({
			access: accessToken
		});

	} catch (error) {
		console.error("Login error", error);
		return res.status(500).send({ error: "Server error" });
	}
};

// retrieve user details
module.exports.retrieveDetails = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		if (!user) return res.status(403).send({ message: "Invalid Signature" });

		user.password = "";
		res.status(200).send(user);
	} catch (error) {
		errorHandler(error, req, res);
	}
};