const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
const password = 'g3SJa0y7zaOyuBU5';

const uri = "mongodb+srv://organicUser:g3SJa0y7zaOyuBU5@cluster0.8ws0m.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

client.connect(err => {
    const productCollection = client.db("organicdb").collection("products");
    // perform actions on the collection object
    //   console.log('database connected');
    app.post("/addProduct", (req, res) => {
        // productCollection.insertOne(product)
        // .then(result => {
        //     console.log('one product added')
        const product = req.body;
        productCollection.insertOne(product)
            .then(result => {
                console.log('data added successfully')
                res.redirect('/')
            })
    })

    app.get('/products', (req, res) => {
        productCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/product/:id', (req, res) => {
        productCollection.find({_id: ObjectId(req.params.id)})
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.patch('/update/:id', (req, res) => {
        console.log(req.body)
        productCollection.updateOne(
            { _id: ObjectId(req.params.id) },
            {
                $set: { price: req.body.price, quantity: req.body.quantity }
            })
            .then(result => {
                res.send(result.modifiedCount > 0)
            })
    })

    app.delete('/delete/:id', (req, res) => {
        productCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            })
    })

});
//   client.close();

app.listen(8080);

