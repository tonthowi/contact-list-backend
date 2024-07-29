const mongoose = require('mongoose')
const password = process.argv[2]

const url = process.env.MONGODB_URI
console.log('Connecting to', url)
mongoose.set('strictQuery', false)
mongoose.connect(url)
    .then(result => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB:', error.message))

const peopleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name cannot be empty'],
        minLength: 2,
        unique: [true, 'Name must be unique']
    },
    email: {
        type: String,
        required: [true, 'Email cannot be empty'],
        unique: [true, 'Email must be unique'],
        validate: {
            validator: function(v) {
              // Regular expression for basic email validation
              return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`}
    },
    phoneNumber: {
        type: Number,
        required: [true, 'Phone number cannot be empty'],
        minLength: 8,
        maxLength: 15,
        unique: [true, 'Phone number must be unique'],
        alidate: {
            validator: function(v) {
              // Regular expression for basic phone number validation
              // This example assumes a 10-digit number, adjust as necessary
              return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
          }
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

peopleSchema.set('toJSON', {
    transform: (doc, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('People', peopleSchema)