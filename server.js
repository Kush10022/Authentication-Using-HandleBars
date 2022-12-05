/*************************************************************************
* BTI325– Assignment 6
* I took the help of my classmate in making the server and data service-auth.js file whose name is ujval and also one of my friend Kalpaj help me a lot 
in making both file actually he already complete this semester before from another college so he is helping me in completing 
this assignment.
*
* Name: Kush Patel Student ID: 104006218 Date: 4th December,2022
*
* Online Cyclic Link: https://drab-plum-bonobo-vest.cyclic.app/
*************************************************************************/ 

var express = require("express");
var path = require("path");
const app = express();
app.use(express.static("public"));
var dataservice = require('./data-service.js');
var dataServiceAuth = require('./data-service-auth.js');
var clientSessions = require("client-sessions");
// part 2 step 1
var multer = require("multer");
//part 2 step 3
const fs = require('fs');
// part 3 step 1
// Assignment 4 part 1 step 1
const exphbs = require("express-handlebars");

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

// assignement 4 part 1 step 1
app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: "main",
runtimeOptions: {
  
  allowProtoPropertiesByDefault: true,

  allowProtoMethodsByDefault: true,

},
helpers:{
  navLink: function(url, options){  // This basically allows us to replace all of our existing navbar links
  return '<li' +  
      ((url == app.locals.activeRoute) ? ' class="active" ' : '') +  
      '><a href=" ' + url + ' ">' + options.fn(this) + '</a></li>'; 
}, equal: function (lvalue, rvalue, options) {  //  This helper will give us the ability to evaluate conditions for equality
  if (arguments.length < 3) 
      throw new Error("Handlebars Helper equal needs 2 parameters"); // throwa the error if the length is less than 3
  if (lvalue != rvalue) { 
      return options.inverse(this); 
  } else { 
      return options.fn(this); 
  } 
}
}
}));


// Setup client-sessions
app.use(clientSessions({
  cookieName: "session", // this is the object name that will be added to 'req'
  secret: "week10example_web322", // this should be a long un-guessable string.
  duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
  activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
}));


app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
 });

 // This is a helper middleware function that checks if a user is logged in
// we can use it in any route that we want to protect against unauthenticated access.
// A more advanced version of this would include checks for authorization as well after
// checking if the user is authenticated
function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}

app.get('/login', (req, res)=> {
  res.render('login');
});

app.get('/register', (req, res)=> {
  res.render('register');
});

app.post('/register', (req, res) => {
  dataServiceAuth.registerUser(req.body).then((data) => {
     res.render("register",{successMessage:"User created"});
 }).catch(err => res.render("register",{errorMessage: err, userName: req.body.userName}));
});

app.post('/login', (req, res) => {
 req.body.userAgent = req.get('User-Agent');

 dataServiceAuth.checkUser(req.body).then((user) => { 
     req.session.user = { 
         userName: req.body.userName,    // complete it with authenticated user's userName 
         email:    user.email,        // complete it with authenticated user's email 
         loginHistory: user.loginHistory        // complete it with authenticated user's loginHistory 
     } 
  
     res.redirect('/employees'); 
 }).catch(err => res.render("login",{errorMessage: err, userName: req.body.userName}));


});
app.get('/logout', (req, res)=> {
req.session.reset();
res.redirect("/");
});


app.get('/userHistory',ensureLogin, (req, res)=>{
res.render('userHistory');
});







// Assignment 4 Part 1 step 1
app.set('view engine', '.hbs');


// assignement 4 part 2 step 1

app.use(function(req,res,next){
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
  next();
  });

//part 2 step 2
app.post("/images/add",ensureLogin, upload.single("imageFile"), (req, res) => {
  res.redirect("/images");
});


//part 2 step 3 // assignement 4 part 2 step 1
app.get("/images",ensureLogin,function(req,res){
  fs.readdir("./public/images/uploaded", function(err, items){ // updating for the handlebars.
      for (var i=0; i<items.length; i++) {  // for loop so that i can print every image that user can upload.
          items[i];
      }
      return res.render("images",{images:items});
    }) 
});

// part 3 step 2
app.post("/employees/add",ensureLogin, (req, res) => {
  dataservice.addEmployee(req.body).then((data) =>{
      res.redirect("/employees"); // When the addEmployee function resolves successfully, redirect to the "/employees" route. 
  });
})

// part 4 step 1 
// updating everything to render so that it connect to hbs file.
app.get('/employees',ensureLogin, function(req, res) {
if(req.query.department){
  dataservice.getEmployeesByDepartment(req.query.department).then((data) => { // this checks if the query string is for department. 
    res.render("employees",data.length>0?{employees:data}:{message:"No results"});  // modifying to use res.render instead of res.json
}).catch(err => res.render({message: "no results"}));
} else if(req.query.status){
  dataservice.getEmployeesByStatus(req.query.status).then((data) => { // this checks if the query string is for status.
    res.render("employees",data.length>0?{employees:data}:{message:"No results"});
}).catch(err => res.render({message: "no results"}));
} else if(req.query.manager){ 
  dataservice.getEmployeesByManager(req.query.manager).then((data) => { // this checks if the query string is for manager.
    res.render("employees",data.length>0?{employees:data}:{message:"No results"});
}).catch(err => res.render({message: "no results"}));
} else if(req.query.employeeNum){ 
  dataservice.getEmployeeByNum(req.query.employeeNum).then((data) => { // this checks if the query string is for emp number.
    res.render("employees",data.length>0?{employees:data}:{message:"No results"});
}).catch(err => res.render({message: "no results"}));
}else{ 
  dataservice.getAllEmployees().then((data) => {
    res.render("employees",data.length>0?{employees:data}:{message:"No results"});
}).catch(err => res.render({message: "no results"}));
}});

// part 4 step 2
app.get("/employee/:empNum",ensureLogin, (req, res) => {
  // initialize an empty object to store the values
  let viewData = {};
  dataservice.getEmployeeByNum(req.params.empNum).then((data) => {
  if (data) {
  viewData.employee = data; //store employee data in the "viewData" object as "employee"
  } else {
  viewData.employee = null; // set employee to null if none were returned
  }
  }).catch(() => {
  viewData.employee = null; // set employee to null if there was an error
  }).then(dataservice.getDepartments)
  .then((data) => {
  viewData.departments = data; // store department data in the "viewData" object as
 "departments"
  // loop through viewData.departments and once we have found the departmentId that matches
  // the employee's "department" value, add a "selected" property to the matching
  // viewData.departments object
  for (let i = 0; i < viewData.departments.length; i++) {
  if (viewData.departments[i].departmentId == viewData.employee.department) {
  viewData.departments[i].selected = true;
  }
  }
  }).catch(() => {
  viewData.departments = []; // set departments to empty if there was an error
  }).then(() => {
  if (viewData.employee == null) { // if no employee - return an error
  res.status(404).send("Employee Not Found");
  } else {
  res.render("employee", { viewData: viewData }); // render the "employee" view
  }
  });
 });


// assignment 4 part 1 step 3
app.get("/", (req, res) => { // updating for the handleBars home root
  res.render("home");
});

app.get("/about", (req, res) => { // updating for the handleBars about root
    res.render("about");
});

// Step 2

app.get('/employees/add',ensureLogin, function(req, res) { // updating for the handleBars employees add root
  dataservice.getDepartments().then((data)=>{
    res.render("addEmployee", {departments:data});
}).catch((err)=>{
    res.render("addEmployee",{departments:[]});
});
});

app.get('/images/add',ensureLogin, function(req, res) { // updating for the handleBars image add root
  res.render("addImage");
});

// app.get('/employees', function (req, res) {
//   dataservice.getAllEmployees().then((data) => {
//     res.json(data);
//   });
// });

app.post("/employee/update",ensureLogin, (req, res) => { // for the updated employee
  dataservice.updateEmployee(req.body).then((data) => {  // updating the employee post method to print all the employees by using the dataService module function.
    res.redirect("/employees");
    
}).catch(err => res.render({message: "no results"}));
});

/* app.get('/managers', function(req, res) {
  dataservice.getManagers().then((dataservice) => {
    res.render("departments",dataservice.length>0?
    {departments:dataservice}:{message:"No results."})
});
});
 */
app.get('/departments',ensureLogin, function(req, res) {  // for the department 
  dataservice.getDepartments().then((data) => {
    res.render("departments", {departments: data});  // updating the get method to render so that it can connect to hbs file of department.
}).catch(err => res.render({message: "no results"}));;
});

app.get("/employees/delete/:empNum",ensureLogin,(req,res)=>{
  dataservice.deleteEmployeeByNum(req.params.empNum).then(()=>{
      res.redirect("/employees");
  }).catch((err)=>{
      res.status(500).send("Unable to Remove Employee / Employee not found)")
  });
});

app.get("/departments/add",ensureLogin,(req,res)=>{
  res.render("addDepartment");
});

app.post("/departments/add", ensureLogin,(req, res)=>{
  dataservice.addDepartment(req.body).then(()=>{
      res.redirect("/departments");
  }).catch((err)=>{
      res.status(500).send("Unable to add the deparmtment.");
  });
});

app.post("/department/update",ensureLogin,(req,res)=>{
  dataservice.updateDepartment(req.body).then(()=>{
      res.redirect("/departments");
  }).catch((err)=>{
      res.status(500).send("Unable to update the department.");
  });
});

app.get("/department/:departmentId",ensureLogin,(req,res)=>{
  dataservice.getDepartmentById(req.params.departmentId).then((data)=>{
      if (!data)
          {res.status(404).send("Department not found");}
      else
          {res.render("department",{department:data});}
  }).catch((err)=>{
      res.status(404).send("Department not found.");
  })
});

app.use(function (req, res) {
  res.sendFile(path.join(__dirname,"./views/error.html"));
});

dataservice.initialize()
.then(dataServiceAuth.initialize)
.then(function () {
  app.listen(port, onhttp);
 })
 .catch(function (err) {
   console.log('Failed to start!' + err);
 });


