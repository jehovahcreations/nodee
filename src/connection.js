const mongoose = require('mongoose')

mongoose.connect('mongodb://13.126.43.30:27017/voip', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(db => console.log('Connection established successfully'))