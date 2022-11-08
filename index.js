const express = require('express');
const app = express();
const cors = require('cors');

const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


//middle wares
app.use(cors());
app.use(express.json());



// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASSWORD)

//mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.eubulyg.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        const serviceCollection = client.db('photoSoot').collection('services')

        app.get('/servicess', async(req,res) => {
            const query = {}
            const cursor = serviceCollection.find(query).limit(3);
            const services = await cursor.toArray();
            res.send(services)
        });

        app.get('/servicessAll', async(req,res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        })


        app.get('/servicess/:id', async(req,res) => {
            const id = req.params.id;
            console.log(id);
            const query = {_id:ObjectId(id)}
            const services = await serviceCollection.findOne(query);
            // const services = await cursor.toArray();
            res.send(services)
        })




    }



    finally{

    }

}
run().catch(error => console.error(error))




app.get('/', (req,res) => {
    res.send('PhotoShoot')
})



app.listen(port, () => {
    console.log(`PhotoShoot on ${port}`);
})