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



const fs = require('fs');
let employees = [];
let departments = [];

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/employees.json', (err, data) => {
      if (err) reject("Failure to read file employees.json!");
      employees = JSON.parse(data);
      resolve();
    });
    fs.readFile('./data/departments.json', (err, data) => {
      if (err) reject("Failure to read file departments.json!");     
      departments = JSON.parse(data);
      resolve();
    });
  });
};

module.exports.getAllEmployees = function () {
  return new Promise((resolve, reject) => {
    if (employees.length == 0) {
      reject('no results returned');
    }
    resolve(employees);
  });
};

module.exports.getManagers = function () {
  return new Promise((resolve, reject) => {
    var man = [];
    for (let i = 0; i < employees.length; i++) {
      if (employees[i].isManager == true) {
        man.push(employees[i]);
      }
    }
    if (man.length == 0) {
      reject('no results returned');
    }
    resolve(man);
  });
};

module.exports.getDepartments = function () {
  return new Promise((resolve, reject) => {
    if (departments.length == 0) {
      reject('no results returned');
    }
    resolve(departments);
  });
};
