
var express = require("express");
var mysql = require('mysql');
var fileSystem = require('fs');
var bodyParser = require('body-parser');

var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : '***',
   database : 'gamedb'
 });

//*****************************
//this shit is awesome
//parses dat from unity....thank you!!!!!!!!!!!!!!
var jsonParser = bodyParser.urlencoded({ extended: true })
//*****************************
var app = express();

app.use(jsonParser);

app.get("/", function(req,res){

 res.send("GAME DB");
});


//used to verify if the user can sign into app
app.post("/signIn", function(req, res) {

  console.log(req.body.userName);
  console.log(req.body.password);

  //login
 
  // console.log("this is the username :"+ req.body.username )
  //check here if password and username are the same in database
  var signInQuery="SELECT EXISTS (SELECT 1 FROM users WHERE userName=\"" + 
  req.body.userName + "\" AND userPass=\"" + req.body.password + "\");";

  connection.query(signInQuery, function(err, results, fields) {
    if (err){
      //error occures, exit function
      console.log('login err: ' + err );
      console.log(req.body.userName + " : not logged in...")  
      return res.send({'response': 'Error', 'error': 'Login Error'});
    
    }else if(results[0][signInQuery.substring(7, signInQuery.length - 1)]) {
        //create jwt token
        //token is encoded with hmac SHA256 by default
      
        console.log(req.body.userName + " : logged in...")   
        res.send("valid login");
    }else{
      console.log(req.body.userName + " : not logged in...")   
      res.send("not valid");
    }
  });
});


//used for sending a message
app.post("/submitScore",function(req,res) {


 console.log("was able to access!!")
 console.log(req.body.userName);
 console.log(req.body.score);

  if(!req.body) return res.sendStatus(400);
  if(!req.body.userName){
    console.log("no username!!!!!!!")
    return res.sendStatus(400);
  } 
 
  let values = {userName: req.body.userName, score: req.body.score};
  connection.query('INSERT INTO scores SET ?', values, function(err, results) {
    if (err){
      console.log("SQL Error : " + err);
      return res.send("error submitting scores");
    }else{
      return res.send("success");
    }

  });  
});

//used for the client to retrieve their messages
app.get("/highscores", function(req, res) {

  
  var top5 ="SELECT * FROM scores order by score desc limit 5";
  let jsonArray = new Array();
  connection.query(top5, function(err, results, fields) {
    if (err){
      //error occures, exit function
      return res.send({'response': 'Error', 'error': err});
    }else {
      //user can have multiple messages waiting for them so create an array to store them all
      console.log("results length : " +results.length);
      for (var i  = 0; i < results.length; i++) {
        //put each message with the users 
        
        jsonArray[i] = {
          userName:results[i]["userName"],
          score:results[i]["score"],
          stamp:results[i]["stamp"]

          // timestamp:results[i]["timestamp"]
        }  
       }
      }  
      var obj = {"obj": jsonArray};
      console.log(JSON.stringify(jsonArray));
      //res.send(jsonArray);
      return res.send(jsonArray); //working on the client side to get results
  
   
     
  
   });  
 
});

app.listen(8081, 'localhost',function(){
console.log('listening on 8081');

});
