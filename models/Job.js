const mongoose = require("mongoose");

const jobSchema = mongoose.Schema({
  company: {
    type: String,
    required: [true, "Please provide company name"],
    trim: true,
    maxlength: 50,
  },
  position: {
    type: String,
    required: [true, "Please provide position"],
    trim: true,
    maxlength: 200
  },
  status: {
    type: String,
    enum: ['interview', 'declined', 'pending'],
    default: 'pending'
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user']
  }
}, {timestamps: true});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
