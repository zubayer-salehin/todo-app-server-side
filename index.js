const express = require('express')
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
require("dotenv").config();
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Todo App')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.v95so.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {

    await client.connect();
    const todoCollection = client.db("todo").collection("items");

    app.get("/items", async (req, res) => {
      const result = await todoCollection.find().toArray();
      res.send(result);
    })

    app.post("/items", async (req, res) => {
      const order = req.body
      const result = await todoCollection.insertOne(order);
      res.send(result);
    })

    app.put("/items/:id", async (req, res) => {
        const id = req.params.id;
        const style = req.body;
        const filter = { _id: ObjectId(id) }
        const options = { upsert: true };
        const updateDoc = {
            $set: {textStyle:style.textStyle}
          };
          const result = await todoCollection.updateOne(filter, updateDoc, options);
        res.send(result);
      })

    app.delete("/items/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) }
        const result = await todoCollection.deleteOne(query);
        res.send(result);
      })

  }
  finally {
    //  await client.close();
  }
}

run().catch(console.dir)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})