const express = require('express');
const app = express();
const cors = require('cors');

const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();


//middle wares
app.use(cors());
app.use(express.json());



console.log(process.env.DB_USER)
console.log(process.env.DB_PASSWORD)

//mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.eubulyg.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});




app.get('/', (req,res) => {
    res.send('PhotoShoot')
})



app.listen(port, () => {
    console.log(`PhotoShoot on ${port}`);
})