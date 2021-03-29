const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const {graphqlHTTP}  = require('express-graphql');

const { connect } = require('./src/config/db');

const graphQLSchema = require('./src/graphql/schema');
const resolversSchema = require('./src/graphql/resolvers')

const app = express();

// Connect DB
connect();

// body parser
app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
    schema: graphQLSchema,
    rootValue: resolversSchema,
    graphiql: true
}));

const host = 'localhost';
const port = 3300;

app.listen(port, host, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
