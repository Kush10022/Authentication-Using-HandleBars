/*************************************************************************
* BTI325– Assignment 2
* I took the help of my classmate in making the dataservice file whose name is ujval and also one of my friend Kalpaj help me a lot 
in making thee server.js file actually he already complete this semester before from another college so he is helping me in making 
this assignment. 
*
* Name: Kush Patel Student ID: 104006218 Date: 5th october, 2022
*_
* Your app’s URL (from Cyclic) : https://awful-worm-pocket.cyclic.app/
*
*************************************************************************/ 

var express = require("express");
var path = require("path");
const app = express();
app.use(express.static("public"));
var dataservice = require('./data-service.js');
// part 2 step 1
var multer = require("multer");
//part 2 step 3
const fs = require('fs');
// part 3 step 1
app.use(express.json());
app.use(express.urlencoded({extended: true}));


const port = process.env.PORT || 8080;
function onhttp(){
  console.log("Express http server listening on port",port);
}
// part 2 step 1

const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

//part 2 step 2
app.post("/images/add", upload.single("imageFile"), (req, res) => {
  res.redirect("/images");
});

//part 2 step 3
app.get("/images",function(req,res){
  fs.readdir("./public/images/uploaded", function(err, items){
      for (var i=0; i<items.length; i++) {  // for loop so that i can print every image that user can upload.
          items[i];
      }
      return res.json({images: items});
    }) 
});

// part 3 step 2
app.post("/employees/add", (req, res) => {
  dataservice.addEmployee(req.body).then((data) =>{
      res.redirect("/employees"); // When the addEmployee function resolves successfully, redirect to the "/employees" route. 
  });
})

// part 4 step 1
app.get('/employees', function(req, res) {
if(req.query.department){
  dataservice.getEmployeesByDepartment(req.query.department).then((data) => { // this checks if the query string is for department. 
    res.json(data);
});
} else if(req.query.status){
  dataservice.getEmployeesByStatus(req.query.status).then((data) => { // this checks if the query string is for status.
    res.json(data);
});
} else if(req.query.manager){ 
  dataservice.getEmployeesByManager(req.query.manager).then((data) => { // this checks if the query string is for manager.
    res.json(data);
});
} else if(req.query.employeeNum){ 
  dataservice.getEmployeeByNum(req.query.employeeNum).then((data) => { // this checks if the query string is for emp number.
    res.json(data);
  });
}
else{ 
  dataservice.getAllEmployees().then((data) => {
    res.json(data);
});
}
});


// part 4 step 2

app.get("/employee/:employeNum",(req,res)=>{ //This route takes one parameter which means employeeNum. 
  dataservice.getEmployeeByNum(req.params.employeNum).then((data)=>{ //return a JSON formatted string containing the employee (one object) whose employeeNum matches the value.
    res.json(data);
      });
    });


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname,"./views/home.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname,"./views/about.html"));
});

// Step 2

app.get('/employees/add', function(req, res) {
  res.sendFile(path.join(__dirname, "./views/addEmployee.html"));
});

app.get('/images/add', function(req, res) {
  res.sendFile(path.join(__dirname, './views/addImage.html'));
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


