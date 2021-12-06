const Client = require("pg").Client;
// import Client from "pg";

const client = new Client({ user: "postgres", password: "", host: "localhost", port: 5432, database: "rbgdatabase" });
client.connect();
module.exports = client;