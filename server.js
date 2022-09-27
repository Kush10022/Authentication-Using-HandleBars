const express = require('express');
const path = require('path');
const app = express()
app.use(express.static("public"))
var dataservice = require('./data-service.js');

const port = process.env.PORT || 8080;
function onhttp(){
  console.log("Express http server listening on port",port );
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,"./views/home.html"));
})

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname,"./views/about.html"));
})

app.get('/employees', function (req, res) {
  dataService.getAllEmployees().then((data) => {
    res.json(data);
  });
});

app.get("/managers", function(req, res){
  dataservice.getAllManagers().then((data) => {
    res.json(data);
  }
)});


app.get("/department", function(req, res){
  dataservice.getAllDepartments().then((data) => {
    res.json(data);
  }
)});
app.use(function (req, res) {
  res.status(404).send('Page Not Found');
});



//// setup http server to listen on HTTP_PORT
dataservice
 .initialize()
 .then(function () {
   app.listen(HTTP_PORT, onHTTPStart);
 })
 .catch(function (err) {
   console.log('Failed to start!' + err);
 });


app.listen(port, onhttp);