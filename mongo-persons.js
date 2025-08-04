const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Usage: node mongo-persons.js <password> [name] [number]')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://ratanomni:${password}@cluster0.ysezeir.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  number: {
    type: String,
    required: true,
    minlength: 8
  }
})

const Person = mongoose.model('Person', personSchema)

// If name and number provided, create new person
if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}
// If only password provided, show all persons
else {
  Person.find({}).then(persons => {
    console.log('phonebook:')
    persons.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}