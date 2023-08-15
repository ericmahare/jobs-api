require('dotenv').config({path: '../.env'})
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    trim: true,
    match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide valid email'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    trim: true,
    minlength: 6
  }
})

// hash password
userSchema.pre('save', async function(){
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Create token
userSchema.methods.createToken = function() {
  return jwt.sign({userID: this._id, name: this.name}, process.env.JWT_SECRET, {expiresIn: "30d"})
}

// compare passwords
userSchema.methods.comparePassword = async function(pass) {
  const isMatching = bcrypt.compare(pass, this.password)
  return isMatching
}
const User = mongoose.model('User', userSchema)

module.exports = User
