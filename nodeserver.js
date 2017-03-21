
var express = require("express");
var mysql = require('mysql');
var fileSystem = require('fs');
var bodyParser = require('body-parser');

var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : 'goku562',
   database : 'gameserver'
 });


var jsonParser = bodyParser.json()

var app = express();

app.use(jsonParser);

app.get("/", function(req,res){

 res.send("GAME DB");
});

//used for sending a message
app.get("/leaderboards",function(req,res) {

  var jsonArray;
  console.log("in leaderboards..");
  if(!req.body) return res.sendStatus(400);
  connection.query('select * from  users', function(err, results) {
    if (err){
      console.log("SQL Error : " + err);
      
    }else{
      for (var i  = 0; i < results.length; i++) {
        //put each message with the users 
        console.log(i + " user " + results[i]["userName"] );
        console.log("pass " + results[i]["userPass"]);
      } 
      res.send(
            {'response': 'invaliddat',
            'message': 'Incorrect username or password',
            'jwt': ""
          });
    }
  });  
});








app.post('/register', function (req, res) {
  if (!req.body) return res.sendStatus(400);
  if(!req.body.username) return res.sendStatus(400);
  if(!req.body.password) return res.sendStatus(400);
  if(req.body.username.length < 1) return res.sendStatus(400);
  if(req.body.password.length < 1) return res.sendStatus(400);
  
  let values = {username: req.body.username, password: req.body.password};
  connection.query('INSERT INTO users SET ?', values, function(err, results) {
    if (err){
   
    }else {
    //create jwt token
      console.log(req.body.username +" has just registered...");
      //token is encoded with hmac SHA256 by default
     
    }
  })
})


//used to verify if the user can sign into app
app.post("/signIn", function(req, res) {

  if (!req.body) return res.sendStatus(400);
  if(!req.body.username) return res.sendStatus(400);
  if(!req.body.password) return res.sendStatus(400);
 
  console.log("this is the username :"+ req.body.username )
  //check here if password and username are the same in database
  var signInQuery="SELECT EXISTS (SELECT 1 FROM users WHERE username=\"" + 
      req.body.username + "\" AND password=\"" + req.body.password + "\");";

  connection.query(signInQuery, function(err, results, fields) {
    if (err){
      //error occures, exit function
      console.log('login err: ' + err );
      return res.send({'response': 'Error', 'error': 'Login Error'});
    
    }else if(results[0][signInQuery.substring(7, signInQuery.length - 1)]) {
        //create jwt token
        //token is encoded with hmac SHA256 by default
      
        console.log(req.body.username + " : logged in...")   
      }
      else 
        return res.send(
            {'response': 'invaliddat',
            'message': 'Incorrect username or password',
            'jwt': ""
          });
    });
});


//used for sending a message
app.post("/sendMessage",function(req,res) {


 console.log("was able to access!!")
 console.log(req.body.username);
 console.log(req.body.receiverName);
 console.log(req.body.message);
 console.log(req.body.date);

  if(!req.body) return res.sendStatus(400);
  if(!req.body.username) return res.sendStatus(400);
  if(!req.body.receiverName) return res.sendStatus(400);
  if(!req.body.message) return res.sendStatus(400);
  if(!req.body.date) return res.sendStatus(400);

  let values = {username: req.body.username, receiverName: req.body.receiverName,
                message: req.body.message, timestamp: req.body.date};
  connection.query('INSERT INTO messages SET ?', values, function(err, results) {
    if (err){
      console.log("SQL Error : " + err);
      return res.send({'response ': 'error',
                       'message': 'message did not go through',
                       'jwt': ""});
    }else{
      return res.sendStatus(200);
    }
  });  
});

//used for the client to retrieve their messages
app.get("/getMessages", function(req, res) {

  console.log(req.auth.username);

  var getMessageQuery ="SELECT * FROM messages WHERE receiverName=\""+req.auth.username+"\";";
  let jsonArray = new Array();
  connection.query(getMessageQuery, function(err, results, fields) {
    if (err)
      //error occures, exit function
      return res.send({'response': 'Error', 'error': err});
    else {
      //user can have multiple messages waiting for them so create an array to store them all
      console.log("results length : " +results.length);
      // for (var i  = 0; i < results.length; i++) {
      //   //put each message with the users 
      //   console.log("messages " + results[i]["message"] );
      //   jsonArray[i] = {
      //     message:results[i]["message"],
      //     sender:results[i]["username"],
      //     // timestamp:results[i]["timestamp"]
      //   }  
      // }
        //test with user that has messages
        jsonArray[0] = {
          message:results[0]["message"],
          sender:results[0]["username"],
          timestamp:results[0]["timestamp"]
        }  
        jsonArray[1] = {
          message:results[1]["message"],
          sender:results[1]["username"],
          timestamp:results[1]["timestamp"]
        }  
      console.log(jsonArray);
      //res.send(jsonArray);
      res.sendStatus(200); //working on the client side to get results
  
   
   }
   });  
 
});

app.listen(8081, 'localhost',function(){
console.log('listening on 8081');

});