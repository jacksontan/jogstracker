var mongoose = require( 'mongoose' );
var ObjectId = mongoose.Schema.Types.ObjectId;

var jogSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  time: {
    type: Number,
    required: true
  },
  distance: {
    type: Number,
    required: true
  },
  user_id: {
	type: ObjectId,
	required: true,
	ref: "User"
  },
  weekNo: {
    type: Number,
  }
});

jogSchema.methods.getSpeed = function(password){
  return this.distance / this.time;
};
mongoose.model('Jog', jogSchema);
