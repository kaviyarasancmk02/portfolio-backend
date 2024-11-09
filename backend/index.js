const express = require("express");
const {graphqlHTTP} = require("express-graphql");
const {buildSchema} = require("graphql");
const {MongoClient} = require("mongodb");
const cors = require("cors");

const app = express();

app.use(cors({origin: "http://localhost:5173"}));

const url =
  "mongodb+srv://kaviyarasan:eU5DvAoxpKVJrLuz@cluster0.gryoa.mongodb.net/portfolio";
const client = new MongoClient(url);

async function connectToDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}
connectToDB();

const schema = buildSchema(`
  type Query {
    getName: String
  }
`);

const root = {
  getName: async () => {
    const db = client.db("portfolio");
    const user = await db.collection("userdetails").findOne();
    return user ? user.name : "Name not found";
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000/graphql");
});
