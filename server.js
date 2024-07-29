require('dotenv').config()
const People = require('./models/people')
const express = require('express')
const app = express()
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    if( error.name === 'CastError') {
        res.status(400).json({ error: 'Invalid ID' })
    } else if( error.name === 'ValidationError') {
        res.status(400).json({ error: error.message })
    } else if (error.code === '11000') {
        res.status(400).json({ error: 'Name must be unique' })
    }
}

const unknownEndpoint = (req, res, next) => {
    res.status(404).json({ error: 'Unknown endpoint' })
}

// API endpoints
app.get('/', (req, res) => {
    res.send('<p>What?</p>')
})

app.get('/api/peoples', (req, res, next) => {
    People.find({})
    .then(persons => {
        res.json(persons)
    })
    .catch(error => next(error))
})

app.get('/api/peoples/:id', (req, res, next) => {
    People.findById(req.params.id)
    .then(person => {
        if(person) {
            res.json(person)
        } else {
            res.status(404).json({ error: 'Person not found' })
        }
    })
    .catch(error => next(error))
})

app.post('/api/peoples', (req, res, next) => {
    const person = new People (
        {
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        timestamp: new Date()
        }
    )
    person.save()
    .then(savedPerson => res.json(savedPerson))
    .catch(error => next(error))

})

app.put('/api/peoples/:id', (req, res, next) => {
    const { name, email, phoneNumber } = req.body
    People.findByIdAndUpdate(req.params.id, {name, email, phoneNumber}, {new:true, runValidators:true, context:'query'})
    .then(updatedPerson => {
        res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/peoples/:id', (req, res, next) => {
    People.findByIdAndDelete(req.params.id)
    .then(() => {
        res.status(204).end()
    })
    .catch(error => next(error))
})

app.use(errorHandler)
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
