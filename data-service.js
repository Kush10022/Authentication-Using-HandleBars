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
const Sequelize = require("sequelize");

var sequelize = new Sequelize('scendwut', 'scendwut', '3Fp5tmpXfV0pAJ4JTvgG6wkYxumlDIoc', { // connecting to databse.
  host: 'heffalump.db.elephantsql.com',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
  ssl: true
 },
 query:{raw: true} // update here. You need it.
 });

 sequelize.authenticate().then(()=> console.log('Connection success.'))
.catch((err)=>console.log("Unable to connect to DB.", err));


// creating data models
var Employee = sequelize.define("Employee", {employeeNum:{
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  SSN: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressState: Sequelize.STRING,
  addressPostal: Sequelize.STRING,
  maritalStatus: Sequelize.STRING,
  isManager: Sequelize.BOOLEAN,
  employeeManagerNum: Sequelize.INTEGER,
  status: Sequelize.STRING,
  department: Sequelize.INTEGER,
  hireDate: Sequelize.STRING
});

var Department = sequelize.define("Department",{departmentId:{
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  departmentName: Sequelize.STRING
});







// updating all the dataservice function.

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    sequelize.sync().then(()=>{ resolve();
  }).catch(()=>{
    reject("unable to sync the database");
  });
});
};

module.exports.getAllEmployees = function () {
  return new Promise((resolve, reject) => {
   Employee.findAll().then((data) => {resolve(data);
  }).catch((err) =>{
    reject("no results returned");
  })
  });
};

// module.exports.getManagers = function () {
//   return new Promise((resolve, reject) => {
//     .findAll().then((data) => {resolve(data);
//     }).catch((err) =>{
//       reject("no results returned");
//     })
//     });
// };

module.exports.getDepartments = function () {
  return new Promise((resolve, reject) => {
    Department.findAll().then((data) => {resolve(data);
    }).catch((err) =>{
      reject("no results returned");
    })
    });
};

/*------------------------------------------------------------------------------------------------------------------- */
/* Assignment 2 */
// part 3 step 3
module.exports.addEmployee = (employeeData)=> {return new Promise((resolve, reject)=> {
  employeeData.isManager = (employeeData.isManager)?true:false;        
  for (let temp in employeeData)
      {
          if (employeeData[temp]=="")
              employeeData[temp] = null;
      }
  Employee.create(employeeData).then(()=>{resolve();
  }).catch((err)=>{
      reject("Unable to Create Employee");
  });
});
}
// PART 4
// for employee by status.
module.exports.getEmployeesByStatus = (status)=> {
  return new Promise((resolve, reject)=> {
    Employee.findAll({where:{status:status}}).then((data) => {resolve(data);
    }).catch((err) =>{
      reject("no results returned");
    })
    });
}
// for employee by department 
module.exports.getEmployeesByDepartment = (department)=> {
  return new Promise((resolve, reject)=> {
    Employee.findAll({where: {department: department}}).then((data) => {resolve(data);
    }).catch((err) =>{
      reject("no results returned");
    })
    });
}
// for employee by manager.
module.exports.getEmployeesByManager = (manager)=> {
  return new Promise((resolve, reject)=> {
    Employee.findAll({where:{employeeManagerNum: manager}}).then((data)=>{resolve(data);
  }).catch((err)=>{
      reject("No results returned");
  });
    });
}
// for employee by number.
module.exports.getEmployeeByNum = (numb) =>{
  return new Promise((resolve, reject)=> {
    Employee.findAll({where:{employeeNum: numb}}).then((data)=>{resolve(data[0]);
  }).catch((err)=>{
      reject("no results returned")
  });
    });
}
/*------------------------------------------------------------------------------------------------------------------- */
/* Assignment 4 */
module.exports.updateEmployee = function(employeeData) {
  return new Promise((resolve, reject)=> {
    employeeData.isManager= employeeData.isManager?true:false;
    for (let temp in employeeData)
        {
            if (employeeData[temp]=="")
                employeeData[temp]=null;
        }
    Employee.update(employeeData,{where: {employeeNum: employeeData.employeeNum}}).then(()=>{resolve();
    }).catch((err)=>{
        reject("unable to update employee");
    });  
});
}

module.exports.deleteEmployeeByNum = function(empNum){
  return new Promise((resolve, reject)=>{
      Employee.destroy({where: {employeeNum: empNum}}).then(()=>{resolve();
      }).catch((err)=>{
          reject("Unable to delete employee");
      });
  })
}

module.exports.addDepartment= function(departmentData){
  return new Promise((resolve, reject)=>{
     for (let temp in departmentData)
         {
             if (departmentData[temp]=="")
                 departmentData[temp] = null;
         }
     Department.create(departmentData).then(()=>{resolve();
     }).catch((err)=>{ 
         reject("unable to create department");
     });
  });
}

module.exports.updateDepartment=function(departmentData){
  return new Promise((resolve, reject)=>{
      for (let temp in departmentData)
         {
             if (departmentData[temp]=="")
                 {
                     departmentData[temp] = null;
                 }
         }
     Department.update(departmentData,{where: {departmentId: departmentData.departmentId}}).then(()=>{resolve();
     }).catch((err)=>{
         reject("unable to update department");
     });
  });
}

module.exports.getDepartmentById=function(id){
  return new Promise((resolve, reject)=>{
      Department.findAll({where: {departmentId: id}}).then((data)=>{resolve(data[0]);
          }).catch((err)=>{
              reject("unable to update department");
          });
  });
}