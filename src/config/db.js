const mongoose = require('mongoose');

async function connect()
{
    try {
        await mongoose.connect('mongodb://localhost:27017/event-booking', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('Connected database successfully');
    } catch (error) {
        console.log('Connected database failed: ', error);
    }
}

module.exports = { connect };