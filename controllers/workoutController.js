
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');


const Workout = require('../model/Workout');
// console.log('pasok b dito?');

const { errorHandler } = auth;

// add Workout
module.exports.addWorkout = async (req, res) => {

try	{
	let newWorkout = new Workout({
		userId: req.user.id,
		name: req.body.name,
		duration: req.body.duration
	});

	await newWorkout.save();

	return res.status(201).send(newWorkout);

} catch (saveErr) {
	console.error("Error in saving the Workout", saveErr)
	return res.status(500).send({ error: "Failed to add Work"});
	}	
};

// Get Workout
module.exports.getWorkout = async (req, res) => {

try	{
	/*const newWorkout = new Workout({
		userId: req.user.id,
		name: req.body.name,
		duration: req.body.duration
	});*/

	const workouts = await Workout.find({ userId: req.user.id });

	return res.status(200).send({ workouts });

} catch (error) {
	return res.status(500).send({ message: error.message });
	}	
};

// Update Workout
module.exports.updateWorkout = async (req, res) => {

try	{
	const { workoutId } = req.params;
	const { name, duration, status } = req.body;

	const updatedWorkout = await Workout.findOneAndUpdate(
	{ _id: workoutId, userId: req.user.id }, 
	{ name, duration, status },
	{ new: true }
	);

	if (!updatedWorkout) {
		return res.status(404).send({ message: "Workout not found/unauthorized" });
	}

	return res.status(200).send({ updatedWorkout });

} catch (error) {
	return res.status(500).send({ message: error.message });
	}	
};

// Remove Workout
module.exports.removeWorkout = async (req, res) => {
	try {
		const { workoutId } = req.params;

		const deletedWorkout = await Workout.findOneAndDelete({
			_id: workoutId,
			userId: req.user.id
		});

// use this if needed in history for traceability			
/*			
const deletedWorkout = await Workout.findOneAndUpdate(
  { _id: workoutId, userId: req.user.id },
  { status: "Deleted" },
  { new: true }
);

*/
		if (!deletedWorkout) {
			return res.status(404).send({ message: "Workout not found/unauthorized" });
		}

		return res.status(200).send({ message: "Workout Deleted Successfully" });
	} catch (error) {
		return res.status(500).send({ message: error.message });
	}
};

// Status Updated to Complete
// PATCH /completeWorkoutStatus/:workoutId
module.exports.completeWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const { status } = req.body; // e.g. "In Progress", "Cancelled", etc.

    const allowedStatuses = ["Pending", "In Progress", "Cancelled", "Completed"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).send({ message: "Invalid status value" });
    }

    const updatedWorkout = await Workout.findOneAndUpdate(
      { _id: workoutId, userId: req.user.id },
      { status },
      { new: true }
    );

    if (!updatedWorkout) {
      return res.status(404).send({ message: "Workout not found or unauthorized" });
    }

    res.status(200).send({ message: `Workout status updated to ${status}`, updatedWorkout });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
