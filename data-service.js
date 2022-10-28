/*************************************************************************
* BTI325– Assignment 3
* I took the help of my classmate in making the dataservice file whose name is ujval and also one of my friend Kalpaj help me a lot 
in making thee server.js file actually he already complete this semester before from another college so he is helping me in making 
this assignment.
*
* Name: Kush Patel Student ID: 104006218 Date: 28th October, 2022
*
* Your app’s URL (from Cyclic Heroku) that I can click to see your application:
*  https://blooming-springs-89413.herokuapp.com/
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

/*------------------------------------------------------------------------------------------------------------------- */
/* Assignment 2 */


// part 3 step 3
module.exports.addEmployee = (employeeData)=> {return new Promise((resolve, reject)=> {
    if (employeeData.isManager == undefined) {
      employeeData.isManager = false; // set it to false
    } else{
      employeeData.isManager = true; // se it to true
    }
    employeeData.employeeNum = employees.length+1; // set the employeeNum property of employeeData to be the length of the "employees" array plus one (1)
    employees.push(employeeData); // push the updated employeedata object onto the "employees" array
    resolve(employees);
  });
}

// PART 4
// for employee by status.
module.exports.getEmployeesByStatus = (status)=> {
  return new Promise((resolve, reject)=> {
    var emp_info = [];
    for (let i= 0; i < employees.length; i++) {
      if (employees[i].status == status) {  // compare for the same status.
        emp_info.push(employees[i]);   // if it is same then it will promt that to user screen.
      }
    }
  if (employees.length == 0) {   // if there is no employee it shows no result returned.
    reject("no result returnned");
  }
  resolve(emp_info);
  });
}
// for employee by department 
module.exports.getEmployeesByDepartment = (department)=> {
  return new Promise((resolve, reject)=> {
    var dep_info = [];
    for (let i= 0; i < employees.length; i++) {
      if (employees[i].department == department) { // compare for the same department.
        dep_info.push(employees[i]);// if it founds then it will show the user.
      }
    }
  if (employees.length == 0) {  // if there is not employee found by departement then it shows no result returned.
    reject("no result returnned");
  }
  resolve(dep_info);
  });
}
// for employee by manager.
module.exports.getEmployeesByManager = (manager)=> {
  return new Promise((resolve, reject)=> {
    var manager_info = [];
    for (let i= 0; i < employees.length; i++) {
      if (employees[i].employeeManagerNum == manager) {// compare for the same manager.
        manager_info.push(employees[i]);// if it founds then it will show the user.
      }
    }
  if (employees.length == 0) {// if there is not employee found by manager then it shows no result returned.
    reject("no result returnned");
  }
  resolve(manager_info); 
  });
}
// for employee by number.
module.exports.getEmployeeByNum = (numb) =>{
  return new Promise((resolve, reject)=> {
    var num_info = [];
    for (let i= 0; i < employees.length; i++) {
      if (employees[i].employeeNum == numb) {// compare for the same number.
        num_info.push(employees[i]);// if it founds then it will show the user.
      }
    }
  if (employees.length == 0) {// if there is not employee found by number then it shows no result returned.
    reject("no result returnned");
  }
  resolve(num_info);
  });
}