let mongoose = require('mongoose');

let eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  dateStart: {
    type: Date,
    required: true
  },
  dateEnd: {
    type: Date,
    required: true
  },
  association: {
    type: String,
    required: true
  }
});

let associationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

module.exports.eventModel = mongoose.model('Event', eventSchema);
module.exports.associationModel = mongoose.model('Association', associationSchema);
