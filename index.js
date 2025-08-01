const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.static('dist'))
app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())
let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
  ]


app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const currentTime = new Date().toString()
    
    response.write(`Phonebook has info for ${persons.length} people\n\n`)
    response.write(currentTime)
    response.end()
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id!==id)
    response.status(204).end()
})

app.post('/api/persons', (request, response)=> {
    const data = request.body
    const id = String(Math.floor(Math.random() * 1000000))

    if (persons.some(person => person.name === data.name)) {
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
      }

    if (!data.name) {
        return response.status(400).json({ 
          error: 'name missing' 
        })
      }

      if (!data.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
      }

    const person =     { 
        "id": id,
        "name": data.name, 
        "number": data.number
      }

    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

