const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role:{
    type:String,
    enum:['admin', 'engineer', 'user'],
    default:'user'
  }
});

// Hash the password before saving the user
personSchema.pre('save', async function (next) {
  const person = this;
  if (!person.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    person.password = await bcrypt.hash(person.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

// Compare candidate password with stored hash
personSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password); // ✅ Fixed typo
  } catch (err) {
    throw err;
  }
};

// Export the model
const Person = mongoose.model('Person', personSchema);
module.exports = Person;
