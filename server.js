const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const {graphqlHTTP}  = require('express-graphql');
const { buildSchema } = require('graphql');
const { connect } = require('./src/config/db');
const Event = require('./src/models/event');
const User = require('./src/models/user');

const schema = require('./src/schema/schema');

const app = express();

// Connect DB
connect();

// body parser
app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(schema),
    rootValue: {
        events: () => {
            return Event.find().then( (events) => {
                return events.map( event => {
                    return event;
                });
            }).catch( (err) => {
                console.log(err);
            });
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '606146cd4a2e491108928ab8'
            });
            return event
                .save()
                .then((result) => {
                    console.log(result);
                    return User.findById('606146cd4a2e491108928ab8')
                })
                .then(user => {
                    if (!user) {
                        throw new Error('User did not exit')
                    }
                    user.createdEvents.push(event);
                    return user.save();
                })
                .then( result => {
                    console.log(result);
                    return event;
                })
                .catch(err => { console.log(err);});
        },
        createUser: (args) => {
            return User.findOne({email: args.userInput.email})
            .then( user => {
                if (user) {
                    throw new Error('User already exist');
                }
                return bcrypt.hash(args.userInput.password, 12)
            })
            .then(hasedPassword => {
                const user = new User({
                    name: args.userInput.name,
                    email: args.userInput.email,
                    password: hasedPassword
                });
                return user.save()
            }).then((result) => {
                console.log(result);
                return result;
            })
            .catch(err => { console.log(err);})
        }
    },
    graphiql: true
}));

const host = 'localhost';
const port = 3300;

app.listen(port, host, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
