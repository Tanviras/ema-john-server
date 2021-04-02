const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://emaJohnCustomer:emaJohnCustomer12345@cluster0.pjygh.mongodb.net/emaJohnStore?retryWrites=true&w=majority";


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', function (req, res) {
  res.send('hello world')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect((err) => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection =client.db("emaJohnStore").collection("orders");
  console.log('db connection successfully');




  //to initially send data to database
app.post('/shopProducts', (req, res) => {
    const products = req.body;
    productsCollection.insertMany(products)
    .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount)
    })
})



//adding new product to shop from inventory
app.post('/addProduct', (req, res) => {
    const products = req.body;
    productsCollection.insertOne(products)
    .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount)
    })
})


//Getting data from database to show in shop
app.get('/products', (req, res) => {
    productsCollection.find({})
    .toArray( (err, documents) => {
        res.send(documents);
    })
})



app.get('/product/:key', (req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray( (err, documents) => {
        res.send(documents[0]);
    })
})



app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
    productsCollection.find({key: { $in: productKeys} })
    .toArray( (err, documents) => {
        res.send(documents);
    })
})



app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})

});//client.connect


app.listen(5000)