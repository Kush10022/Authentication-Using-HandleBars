var userdb ="mongodb+srv://Kush:Beats121@userdb.n4wbl1j.mongodb.net/?retryWrites=true&w=majority";
var mongoose = require("mongoose");
var bcrypt = require('bcryptjs')

var Schema = mongoose.Schema;


var userSchema = new Schema({
    "userName": {
        unique: true,
        type: String
    },
    "password": String,
    "email": String,
    "loginHistory": [ { dateTime: Date, userAgent: String} ]
  });

  let User; // to be defined on new connection (see below)

  module.exports.initialize = function(){
    return new Promise((resolve, reject)=> {
        User= mongoose.createConnection(userdb, { useNewUrlParser: true, useUnifiedTopology: true }, function(error){
            if(error){console.log(error);
                reject();
        }
            else {
                console.log("connection successful");
             User = User.model("users", userSchema); 
            resolve();           
        }});
    });   
}


module.exports.registerUser = (userData)=>{
    return new Promise((resolve, reject)=> {
    if(userData.password === "" || userData.password2 === ""){
        reject("Error: user name cannot be empty or only white spaces! ");
    }else if(userData.password != userData.password2){
        reject("Error: Passwords do not match");
    }
    bcrypt.genSalt(10, function(err, salt) { // Generate a "salt" using 10 rounds
        bcrypt.hash(userData.password, salt, function(err, hashValue) { // encrypt the password: "myPassword123"
           if(err){
            reject("There was an error encrypting the password");   
           }else{
            userData.password = hashValue;
    let newUser = new  User(userData);
    newUser.save((err) => {
        if(err && err.code == 11000) {
          reject("User Name already taken");
        } else if(err && err.code != 11000) {
          reject("There was an error creating the user: "+err);
        }
        else{
            resolve();
        }   
      });
      }});
    });
    });
}

module.exports.checkUser = (userData)=>{
    return new Promise((resolve, reject)=> {
        User.findOne({ userName: userData.userName}).exec().then((data) => {
         if (!data){
            reject();
         }else{
            bcrypt.compare(userData.password, data.password).then((res) => {
                if (res === true) {
                    data.loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
                    User.updateOne({ userName: data.userName},{ $set: { loginHistory:  data.loginHistory}}
                      ).exec().then((userData) => {resolve(data);}).catch((err) => {
                        reject("Unable to find user: "+userData.user);
                      });
                  }
                  else if(res === false){
                    reject("Unable to find user: "+userData.userName);
                  }
                });
            }
        })
    });
}