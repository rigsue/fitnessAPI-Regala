const express = require('express');
const workoutController = require('../controllers/workoutController');
const { verify } = require('../middleware/auth');
const router = express.Router();

router.post("/addworkout", verify, workoutController.addWorkout);
router.get("/getMyWorkouts", verify, workoutController.getWorkout);
router.put("/updateWorkout/:workoutId", verify, workoutController.updateWorkout);
router.delete("/deleteWorkout/:workoutId", verify, workoutController.removeWorkout);
router.patch("/completeWorkoutStatus/:workoutId", verify, workoutController.completeWorkout);


module.exports = router;