const express = require('express')
const app = express()
const cors = require("cors");
const port = 3000


//middleware
app.use(cors())
app.use(express.json())
//nubis_01
//O2XxFbkywGrPS1bD

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://nubis_01:O2XxFbkywGrPS1bD@cluster0.vfbjj6s.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    const userCollection = await client.db("productsDB").collection("products")

    // Create a new product 
    app.post("/products", async(req, res) => {
        const product = req.body
        const result = await userCollection.insertOne(product)
        res.send(result)
    })


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})