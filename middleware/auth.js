const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = process.env.JWT_SECRET;

//	- - Create Access Token - -
module.exports.createAccessToken = (user) => {
	const data = {
		id: user._id,
		email: user.email
	};
	return jwt.sign(data, JWT_SECRET_KEY, {}); 
}

// - - Verify Middleware Token - -
module.exports.verify = (req, res,next) => {
	console.log(req.headers.authorization);

	let token = req.headers.authorization;

	if (typeof token === "undefined"){
		return res.status(401).send({ auth: "Failed. No Token Provided" });
	} else {
		console.log(token);

		token = token.slice(7, token.length);
		console.log(token);

		// Decrypt Token

		jwt.verify(token, JWT_SECRET_KEY, function(err, decodeToken){
			if(err) {
				return res.status(404).send({
					auth: "Failed",
					error: "User not found",
					message: err.message
				});
			}
			req.user = decodeToken;
			return next();
		})
	}
}


// Middleware user authentication checker
module.exports.isLoggedin = (req, res, next) => {
	if (req.user) {
		next()
	} else {
		res.sendStatus(401);
	}
}

// Error Handler Middleware
module.exports.errorHandler = (err, req, res, next) => {
	console.error(err);

	const statusCode = err.status || 500
	const errorMessage = err.message || 'Internal Server Error';

	res.status(statusCode).json({
		error: {
			message: errorMessage,
			errorCode: err.code || 'server_error',
			details: err.details
			}
	});
};