
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

// import routes
const userRoutes = require('./routes/user');
const workoutRoutes = require('./routes/workout')

// const PORT = 4000;
const app = express();

const corsOptions = {
	origin: [
		'http://localhost:5173',
		'http://localhost:3000',
		// 'http://localhost:4000'
	],
	credentials: true,
	optionsSuccessStatus: 200 };


//Routes Middleware

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/*
const workoutRoutes = require("./routes/workout");
const userRoutes = require("./routes/user");
app.use("/workouts", workoutRoutes);
app.use("/users", userRoutes);
*/

// Mongodb connection
/*
mongoose.connect(process.env.MONGODB_STRING)
.then(() => console.log('Now connected to MongoDB'))
.catch(err => console.error('FitnessDB connection error:', err));

mongoose.connection.once('open', () => console.log('You are now connected to MongoDB Fitness API / Atlas.'))
*/

// async/await < < <
async function connectDB() {
	try {
		await mongoose.connect(process.env.MONGODB_STRING);
		console.log('Now connected to MongoDB fitness api');

		// for Test model only to create schema inside mongodb < < <
		/*
		const testSchema = new mongoose.Schema({ message: String });
		const TestingLng = mongoose.model('TestingLng', testSchema);

		await TestingLng.create({ message: 'Hi, Hello MongoDB I am inside?'})
		console.log('TestingLng document created!');
		*/
		// End of test Model < < <

		} catch (err) {
			console.error('Error connection on MongoDB:', err.message);
		}
	}

connectDB();

// Backend Routes

app.use('/users', userRoutes);
app.use('/workouts', workoutRoutes);


// Mongodb connection end < < <

// Server Gateway response
if(require.main === module){
	const PORT = process.env.PORT || 4000;
	app.listen(PORT, () => 
	    console.log(`API is now online on port ${ PORT }`));
	};

module.exports = { app, mongoose };