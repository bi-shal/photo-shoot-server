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
        const reviewCollection = client.db('photoSoot').collection('review')

        //JWT
        app.post('/jwt',(req,res) => {
            const user = req.body;
            // console.log(user);
            const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, {expiresIn:'1hr'})
            console.log({token});
            res.send({token})
        })



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
            // console.log(id);
            const query = {_id:ObjectId(id)}
            const cursor = await serviceCollection.findOne(query);
            // const services = await cursor.toArray();
            res.send(cursor)
        })

        //review
         app.post('/review', async(req,res) => {
            const order = req.body;
            console.log(order)
            const result = await reviewCollection.insertOne(order)
            res.send(result)
        });

        app.get('/reviews', async(req,res) => {
            const query = {}
            const cursor = reviewCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
            
        });

        //-----email-query
        app.get('/reviewsss', async(req,res) => {
            // console.log(req.query.email)
            let query = {};
            if(req.query.email){
                query={
                    email:req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const service = await cursor.toArray()
            res.send(service)
        });

        //delete

        app.delete('/revieww/:id', async(req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })

        //edit 
        app.patch('/revieww/:id', async(req,res) => {
            const id = req.params.id;
            const status = req.body.status;
            const query = {_id: ObjectId(id)};
            const updateDoc = {
                $set:{
                    status: status
                }
            }
            const result = await reviewCollection.updateOne(query,updateDoc);
            res.send(result)
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