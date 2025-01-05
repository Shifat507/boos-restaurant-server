const express = require('express')
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

//bossUser
//Hc7IAD9XHGqedZPQ



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vyhfd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCollection = client.db("bossDb").collection("users");
    const menuCollection = client.db("bossDb").collection("menu");
    const reviewCollection = client.db("bossDb").collection("reviews");
    const cartCollection = client.db("bossDb").collection("carts");

    
    app.get('/menu', async(req, res)=>{
        const result = await menuCollection.find().toArray();
        res.send(result);
    })    
    app.get('/reviews', async(req, res)=>{
        const result = await reviewCollection.find().toArray();
        res.send(result);
    })    

    // user related APIs:
    app.post('/users', async(req, res)=>{
      const user = req.body;
      //check user is already exist or not
      const query = {email: user.email};
      const existingUser = await userCollection.findOne(query);
      if(existingUser){
        return res.send({message: 'User already exist', insertedId: null});
      }

      const result = await userCollection.insertOne(user);
      res.send(result)
    } )

    app.get('/users', async(req, res)=>{
      const result = await userCollection.find().toArray();
      res.send(result);
    })

    // cartCollection
    // add to cart data
    app.get('/carts', async(req, res)=>{
      const email = req.query.email;
      const query = {email: email};
      // console.log('Query email:', email);
      const result = await cartCollection.find(query).toArray();
      res.send(result)
    })
    
    // add to card --> insert to DB
    app.post('/carts', async(req,res)=>{
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
    })
    // delete cart item
    app.delete('/carts/:id', async(req, res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('Boss is running');
})
    

app.listen(port, ()=>{
    console.log(`Boss is running on port: ${port}`);
})