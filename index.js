const inquirer = require('inquirer');
const db = require('./db/connection');
// require('console.table');
const utils = require('util');
db.query = utils.promisify(db.query);
// const logo = require('asciiart-logo');


function init() {
    // const logoText = logo({ name: 'Employee Database Management' }).render();
    // console.log(logoText);
    startApp();
}
startApp();
function startApp() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'What would you like to do?',
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
                    'Quit',
                ],
            },
        ])
        .then((options => {
            switch (options.choice) {
                case "View all departments":
                    viewDepts();
                    break;
                case "View all roles":
                    viewRoles();
                    break;
                case "View all employees":
                    viewEmployees();
                    break;
                case "Add a department":
                    addDepartment();
                    break;
                case "Add a role":
                    addRoleAA();
                    break;
                case "Add an employee":
                    addEmployee();
                    break;
                case "Update an employee role":
                    updateEmployee();
                    break;
                case "Quit":
                    db.end();
            }
        }));
};

// functions
// function addDepatment(){};
// function addRoleAA(){};
// function addEmployee(){};
// function updateEmployee(){};

function viewDepts(){
    const sql = 'SELECT * FROM department';
    db.query(sql, (err, dbRes)=>{
        if (err) {
            console.log(err)
            return;
        } 
        console.table(dbRes);
        startApp();
    });
};

function viewRoles(){
    const sql = 'SELECT * FROM roles';
    db.query(sql, (err, dbRes)=>{
        if (err) {
            console.log(err)
            return;
        } 
        console.table(dbRes);
        startApp();
    });
};

function viewEmployees(){
    const sql = 'SELECT * FROM employee';
    db.query(sql, (err, dbRes)=>{
        if (err) {
            console.log(err)
            return;
        } 
        console.table(dbRes);
        startApp();
    });
};