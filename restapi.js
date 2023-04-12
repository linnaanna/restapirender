// Use express-module
var express = require("express");
var app = express();

// This for the templates
var bodyParser = require("body-parser");
app.use(bodyParser.json());

// Mongo db module
const MongoClient = require("mongodb").MongoClient;

/* Let's take env parameters in use */
require("dotenv").config();

// Set userid and pw. To be set in Atlas pages
var user = "annalinna";
var pw = "SiniTaivas";

// Create connection script to db

const uri =
  "mongodb+srv://" +
  user +
  ":" +
  pw +
  "@cluster0.vnahq1k.mongodb.net/?retryWrites=true&w=majority";

// Make the routes

// Print one car
app.get("/api/:id", function (req, res) {
  // Create connection object
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  var query = {
    id: req.params.id,
  };

  async function connectAndFetchOne() {
    try {
      await client.connect();
      const collection = client.db("cardb").collection("cars");

      // make query with collection-object
      var result = await collection.find(query).limit(10).toArray();

      res.send(result);
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
      console.log("Connection closed to MONGO");
    }
  }
  connectAndFetchOne();
});

// Print all cars
app.get("/api/getall", function (req, res) {
  // Create connection object
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  async function connectAndFetch() {
    try {
      await client.connect();
      const collection = client.db("cardb").collection("cars");

      // make query with collection-object
      var result = await collection
        .find() // Use empty find to show all contents
        .limit(10)
        .toArray();

      res.send(result);
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
      console.log("Connection closed to MONGO");
    }
  }
  connectAndFetch();
});

// Add one car
app.post("/api/add", function (req, res) {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  var newCar = {
    id: req.body.id,
    brand: req.body.brand,
    model: req.body.model,
    year: req.body.year,
  };

  async function connectAndPost() {
    try {
      await client.connect();
      const collection = client.db("cardb").collection("cars");
      collection.insertOne(newCar);
      console.log("New car inserted");

      // make query with collection-object
      var result = await collection
        .find() // Use empty find to show all contents
        .limit(10)
        .toArray();

      res.send(result);
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
      console.log("Connection closed to MONGO");
    }
  }
  connectAndPost();
});

// Modify the information of one car
app.put("/api/update/:id", function (req, res) {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  var query = {
    id: req.params.id,
  };

  async function connectAndModify() {
    try {
      await client.connect();
      const collection = client.db("cardb").collection("cars");

      collection.updateOne({ id: req.params.id }, { $set: { year: 2013 } });

      // make query with collection-object
      var result = await collection.find(query).limit(10).toArray();

      res.send(result);
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
      console.log("Connection closed to MONGO");
    }
  }
  connectAndModify();
});

// Remove car by ID
app.delete("/api/delete/:id", function (req, res) {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  var car = {
    id: req.params.id,
  };

  async function connectAndDelete() {
    try {
      await client.connect();
      const collection = client.db("cardb").collection("cars");
      collection.deleteOne(car);
      console.log("Car deleted");

      // make query with collection-object
      var result = await collection
        .find() // Use empty find to show all contents
        .limit(10)
        .toArray();

      res.send(result);
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
      console.log("Connection closed to MONGO");
    }
  }
  connectAndDelete();
});

// Web server by express
var PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
  console.log("Example app is listening on port %d", PORT);
});
