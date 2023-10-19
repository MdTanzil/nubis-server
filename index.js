const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;

//middleware
app.use(cors());
app.use(express.json());
//nubis_01
//O2XxFbkywGrPS1bD

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const productCollection = await client
      .db("productsDB")
      .collection("products");
    const cartCollection = await client.db("productsDB").collection("carts");
    const brandImageCollection = await client.db("productsDB").collection("brandImage");


    // Create a new product
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    // get product brand name wise
    app.get("/products-brand/:brandName/", async (req, res) => {
      const brand = req.params.brandName;
      const result = await productCollection
        .find({ brandName: brand })
        .toArray();
      res.send(result);
    });
    // get a single product
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });
    // update a single product
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const product = req.body;
      const {
        name,
        brandName,
        type,
        price,
        rating,
        description,
        thumnailImage,
        image01,
        image02,
      } = product;
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: name,
          brandName: brandName,
          type: type,
          price: price,
          description: description,
          rating: rating,
          thumnailImage: thumnailImage,
          image01: image01,
          image02: image02,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(result);
    });
    // add to cart 
    app.post("/cart", async (req, res) => {
      const cart = req.body;

      const result = await cartCollection.insertOne(cart);

      res.send(result);
    });
    // get cart product 
    app.get('/cart', async(req,res)=>{
        
        const result = await cartCollection.find().toArray()
        


        res.send(result)
    })
    // delete cart item 
    app.delete('/cart/:id', async(req,res)=>{
        const id = req.params.id
         const query = { _id: new ObjectId(id) };
         const result = await cartCollection.deleteOne(query)
         res.send(result)

    })
    // brand image  get url

    app.get('/brand-images/:name', async(req, res)=>{
        const name = req.params.name
        const query = { name : name }
        const result = await brandImageCollection.findOne(query)
        res.send(result)


    })
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
