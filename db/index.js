const mongoose = require('mongoose')
const maxPoolSize = 10
const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize,
}
mongoose.connect('mongodb://localhost:27017/test', connectionOptions)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', () => {
    console.log('Connected to MongoDB')
})

module.exports = mongoose