//requiring modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

var today = new Date();
var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear()




//setting up the app
const app = express()
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



// connecting to mongoose and creating a new dataabase
mongoose.connect("mongodb://admin-sangeeta:JLlCixxIoO3lYCwJ@cluster0-shard-00-00.vllwc.mongodb.net:27017,cluster0-shard-00-01.vllwc.mongodb.net:27017,cluster0-shard-00-02.vllwc.mongodb.net:27017/taskblog?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority",  { useUnifiedTopology: true, useNewUrlParser: true});


// creating a schema for blogdb
const cardSchema = new mongoose.Schema ({
  title: String,
  content: String,
  source: String,
  date: String,
})
const Card = new mongoose.model("Card", cardSchema);







//contact page
app.get("/", function (req, res) {
  Card.find((err, foundCards) => {
    !err &&  res.render("home", {cards: foundCards})
  });
})


//parameters for fullpageview when clicked on a individual topic
app.get("/home/:topic", (req, res) => {
  Card.find((err, foundCards) => {
   (!err) && foundCards.forEach((eachCard, i=0) => {
       (i == req.params.topic) && res.render("fullpageview", {card: eachCard})
    });
  });
});




// adding data to database
app.post("/create" , (req, res) => {

  let myobj = {
    title: req.body.title,
    source: req.body.source,
    content: req.body.content,
    date : date,
  }


  Card.create(myobj, function(err, response) {
    if (!err) {
      Card.find((err, foundCards) => {
        !err &&  res.render("home", {cards: foundCards})
      });
    }
  })
})
  
  
// deleting item 
app.get("/remove/:item", (req, res) => {
  Card.deleteOne({_id: req.params.item}, function(err) {
    if (!err) {
      Card.find((err, foundCards) => {
          !err &&  res.render("home", {cards: foundCards})
      });
    } 
  })
})


// displaying update page
app.get("/update/:id", (req, res) => {
  Card.findOne({_id: req.params.id}, (err, foundCard) => {
    if(!err) {
      res.render("update", {card: foundCard})
    }
  }) 
})


// updating database
app.post("/update", (req, res) => {
  Card.updateOne(
    { _id: req.body.id},
    {
      title: req.body.title,
      content: req.body.content,
      source: req.body.source,
    },
    function (err) {
      if (!err) {
        Card.find((err, foundCards) => {
          !err &&  res.render("home", {cards: foundCards})
      });
      } 
    })})



  
  //setting a server, which is running the port 3000
  let port = process.env.PORT;
  if (port == null || port == "") {
    port = 3000;
  }
  
  app.listen(port, () => {
    console.log("Server started on port 3000");
  })

