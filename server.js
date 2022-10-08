/*************************************************************************
* BTI325– Assignment 2
* I took the help of my classmate in making the dataservice file whose name is ujval and also one of my friend Kalpaj help me a lot 
in making thee server.js file actually he already complete this semester before from another college so he is helping me in making 
this assignment. 
*
* Name: Kush Patel Student ID: 104006218 Date: 5th october, 2022
*_
* Your app’s URL (from Cyclic) : ______________________________________________
*
*************************************************************************/ 

var express = require("express");
var path = require("path");
const app = express();
app.use(express.static("public"));
var dataservice = require('./data-service.js');
const port = process.env.PORT || 8080;
function onhttp(){
  console.log("Express http server listening on port",port);
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname,"./views/home.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname,"./views/about.html"));
});

app.get('/employees', function (req, res) {
  dataservice.getAllEmployees().then((data) => {
    res.json(data);
  });
});

app.get("/managers", function(req, res){
  dataservice.getManagers().then((data) => {
    res.json(data);
  }
)});


app.get("/departments", function(req, res){
  dataservice.getDepartments().then((data) => {
    res.json(data);
  }
)});

app.use(function (req, res) {
  res.sendFile(path.join(__dirname,"./views/error.html"));
});

dataservice.initialize().then(function () {
  app.listen(port, onhttp);
 })
 .catch(function (err) {
   console.log('Failed to start!' + err);
 });


