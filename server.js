const express = require('express');
const bodyParser = require('body-parser');
const {graphqlHTTP}  = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

// body parser
app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type RootQuery {
            events: [String!]
        }

        type RootMutation {
            createEvent(name: String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return ['Romantic Cooking', 'Sailing', 'All-Night Coding']
        },
        createEvent: (args) => {
            return args.name;
        }
    },
    graphiql: true
}));

const host = 'localhost';
const port = 3300;

app.listen(port, host, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
