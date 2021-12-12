import { Client } from "pg";
import { config } from "dotenv";
import express from "express";
import cors from "cors";
// const client = require("./db");

config(); //Read .env file lines as though they were env vars.

//Call this script with the environment variable LOCAL set if you want to connect to a local db (i.e. without SSL)
//Do not set the environment variable LOCAL if you want to connect to a heroku DB.

//For the ssl property of the DB connection config, use a value of...
// false - when connecting to a local DB
// { rejectUnauthorized: false } - when connecting to a heroku DB
const herokuSSLSetting = { rejectUnauthorized: false }
const sslSetting = process.env.LOCAL ? false : herokuSSLSetting
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: sslSetting,
};

const app = express();

interface Quotes {
  input: string
  title: string
  index: number
}

app.use(express.json()); //add body parser to each following route handler
app.use(cors()) //add CORS support to each following route handler

const client = new Client(dbConfig);
client.connect();

app.get("/rbgquotes", async (req, res) => {
  try {
    const dbres = await client.query('select * from pastebindb order by index desc limit 10');
    res.json(dbres.rows);
  }
  catch (error) {
    console.error(error.message)
  }
});

// 1st. parameters in your endpoint
// 2. mysterious
// 3. request body shape
app.post<{}, {}, Quotes>("/rbgquotes", async (req, res) => {
  try {
    const { input, title } = req.body;
    const newQuote = await client.query("INSERT INTO pastebindb (input, title) VALUES($1, $2)", [input, title]);
    res.json(newQuote.rows[0]);
  }
  catch (error) {
    console.error(error.message)
  }
});

app.delete<{ index: number }, {}, Quotes>("/rbgquotes/:id", async (req, res) => {
  try {
    const { index } = req.params
    const deletedPaste = await client.query("DELETE from pastebindb WHERE index = ($1) RETURNING *", [index]);
    res.json("This quote was deleted: " + deletedPaste.rows[0].input);
  } catch (error) {
    console.error(error.message)
  }
})

//to do app post code
// app.post("/todos", async (req, res) => {
//   try {
//       const { description } = req.body;
//       const newTodo = await client.query("INSERT INTO perntodo (description) VALUES($1) RETURNING *", [description]);
//       res.json(newTodo.rows[0])
//   } catch (err) {
//       console.error(err.message)
//   }
// })


//Start the server on the given port
const port = process.env.PORT;
if (!port) {
  throw 'Missing PORT environment variable.  Set it in .env file.';
}
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
