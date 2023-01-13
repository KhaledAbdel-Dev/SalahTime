const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.json())


MongoClient.connect('mongodb+srv://khaled:Jamilo78@cluster0.77z2sbo.mongodb.net/test', { useUnifiedTopology: true })
    .then(client => {
            console.log('Connected to Database')
            const db = client.db('CRUD-demo')
            const timesCollection = db.collection('money')
            app.use(bodyParser.urlencoded({ extended: true }))
            app.get('/', (req, res) => {
                db.collection('money').find().toArray()
                .then(results => {
                    res.render('index.ejs', { times: results })
                })
                .catch(error => console.error(error))
            })
            app.post('/times', (req, res) => {
                timesCollection.insertOne(req.body)
                .then(result => {
                    res.redirect('/')
                })
                .catch(error => console.error(error))
            })
            app.listen(3000, function() {
                console.log('listening on 3000')
            })
            app.put('/times', (req, res) => {
                console.log(req.body)
                timesCollection.findOneAndUpdate(
                    { name: req.body.name,
                        shift: req.body.shift, },
                    {
                        // only used for the properties we want to update
                        $set: {
                            time: req.body.time
                        }
                    },
                    {
                        upsert: false
                    }
                ).then(result => {
                    res.json('Success')
                })                
            })
            app.delete('/times', (req, res) => {
                timesCollection.deleteMany(
                  { }
                )
                  .then(result => {
                    if (result.deletedCount === 0) {
                        return res.json('No entry to delete')
                      }
                    res.json(`Deleted entry`)
                  })
                  .catch(error => console.error(error))
            })
        })
    .catch(error => console.log(error)) 


