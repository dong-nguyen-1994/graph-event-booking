const Event = require('../../models/event');
const User = require('../../models/user');

module.exports = {
    events: () => {
        return Event.find().populate('creator').then( (events) => {
            return events;
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
}