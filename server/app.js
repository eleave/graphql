const express = require(`express`);
const { graphqlHTTP } = require(`express-graphql`);
const schema = require(`../schema/schema`)
const mongoose = require(`mongoose`);
const { db } = require("../models/director");

const app = express();
const PORT = 3005;

mongoose.connect(`mongodb+srv://tutorials:Ovf8w1O9aV9HtElc@cluster0.tinsj.mongodb.net/graphql?retryWrites=true&w=majority`, {useNewUrlParser: true});

app.use(`/graphql`, graphqlHTTP({
  schema,
  graphiql: true
}));

const dbConnection = mongoose.connection;
dbConnection.on(`error`, err => console.log(`Connection error: ${err}`));
dbConnection.once(`open`, () => console.log(`Connected to DB!`));

app.listen(PORT, err => {
  err ? console.log(error) : console.log("Server Started!");
});
