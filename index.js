const express = require('express');
const app = express();
const cors = require('cors');

const port = process.env.PORT || 5000;
const  jwt =require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


//middle wares
app.use(cors());
app.use(express.json());


//mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.eubulyg.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//jwt-----
function verifyJWT(req,res,next){
    const authHeader=  req.headers.authorization;
    if (!authHeader){
       return res.status(401).send({message:'unauthorized access'})
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
        if(err){
            return res.status(403).send({message:'Forbidden access'})
        }
        req.decoded = decoded;
        next();
    })    
}




async function run(){
    try{
        const serviceCollection = client.db('photoSoot').collection('services')
        const reviewCollection = client.db('photoSoot').collection('review')

        //JWT
        app.post('/jwt',(req,res) => {
            const user = req.body;
            console.log(user);
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
//all
        app.get('/servicessAll', async(req,res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        })

//add
        app.post('/servicessAll', async(req,res) => {
            const order = req.body;
            console.log(order)
            const result = await serviceCollection.insertOne(order)
            res.send(result)
        });



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
        app.get('/reviewsss', verifyJWT, async(req,res) => {
            
// console.log(req.query.email)

const decoded = req.decoded;
            
if (decoded.email !== req.query.email){
 res.status(403).send({message:'unauthorized access'})
}

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