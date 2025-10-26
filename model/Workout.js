const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
userId: {
	type: mongoose.Schema.Types.ObjectId,
	ref: 'User',
	required: true
},
name: {
	type: String,
	required: [true, 'Name is Required']
},

duration: {
	type: String,
	required: [true, 'Duration']
},

status: {
	type: String,
	enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
	default: 'Pending' 	
},

dateAdded: {
	type: Date,
	default: Date.now
}

/*
isActive: {
	type: Boolean,
	default: true
}*/
	
})
 
module.exports = mongoose.model('Workout', workoutSchema);
