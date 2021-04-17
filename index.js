const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = 8000


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kcswx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
  const bookCollection = client.db("petCareHouse").collection("book");
  const reviewCollection = client.db("petCareHouse").collection("review");
  const serviceCollection = client.db("petCareHouse").collection("service");
  const adminCollection = client.db("petCareHouse").collection("admin");
  
  app.post( '/addBook', (req, res) => {
      const books = req.body;
     bookCollection.insertOne(books)
     .then( result => {
         res.send( result.insertedCount > 0)
     })
  })

  app.get('/bookingList', (req, res) => {
      const bookingLists = req.query.email;
      bookCollection.find({email : req.query.email})
      .toArray( (err, result) => {
          res.send(result)
      })
  })

  app.post('/addReview', ( req, res) => {
      const reviews = req.body;
      reviewCollection.insertOne(reviews)
      .then( result => {
          res.send( result.insertedCount > 0)
      })
  })

  app.get('/reviews', (req, res) => {
      reviewCollection.find()
      .toArray( (err, result) => {
          res.send(result)
      })
  })


  app.get('/allOrderList', (req, res) => {
      bookCollection.find()
      .toArray( (err, result) => {
          res.send(result)
      })
  })

  app.post('/addService', (req, res) => {
      const services = req.body;
      serviceCollection.insertOne(services)
      .then( result => {
          res.send(result.insertedCount > 0)
      })
  })

  
  app.get('/services', (req, res) => {

      serviceCollection.find()
      .toArray( (err, result) => {
          res.send(result)
      })
  })
  
  app.get('/book/:id', (req, res) => {
      serviceCollection.find({_id : ObjectID(req.params.id)})
      .toArray( (err, result) => {
          res.send(result[0])
      })
  })
  
  app.get('/manageService', (req, res) => {
      serviceCollection.find()
      .toArray( (err, result) => {
          res.send(result)
      })
  })

  app.get('/delete/:id', (req, res) => {
      serviceCollection.deleteOne({_id : ObjectID(req.params.id)})
      .then( result => {
          res.send(result.deletedCount > 0)
      })
  })


  app.post('/addAdmin', (req, res) => {

      const admin = req.body;
       adminCollection.insertOne(admin)
       .then(result => {
           res.send(result)
       })

  })

  app.post('/isAdmin', (req, res) => {
      const email = req.body.email
      adminCollection.find({admin : email})
      .toArray( (err, adminPerson) => {
          res.send(adminPerson.length > 0)
      })
  })
  

  app.patch('/updateStatus/:id', (req, res) => {
    bookCollection.updateOne({_id : ObjectID(req.params.id)}, 
    {
     $set : {status : req.body.status}
    })
    .then( result => {
        res.send( result.modifiedCount > 0)
    })
  })












});








app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})