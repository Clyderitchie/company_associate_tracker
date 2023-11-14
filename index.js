const { prompt } = require('inquirer');
const db = require('./db/connection');
require('console.table');
const logo = require('asciiart-logo');

function init() {
    const logoText = logo({ name: 'Employee Database Management' }).render();
    console.log(logoText);
    startApp();
}

function startApp() {
    // inquirer
    prompt([
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
                    addRole();
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

function viewDepts() {
    const sql = 'SELECT department.id, department_name AS "department name" FROM department';
    db.query(sql, (err, dbRes) => {
        if (err) {
            console.log(err)
            return;
        }
        console.table(dbRes);
        startApp();
    });
};

function viewRoles() {
    const sql = 'SELECT roles.id, roles.title, roles.salary, department.department_name AS "department" FROM roles JOIN department ON roles.department_id = department.id';
    db.query(sql, (err, dbRes) => {
        if (err) {
            console.log(err)
            return;
        }
        console.table(dbRes);
        startApp();
    });
};

function viewEmployees() {
    const sql = `SELECT employee.id, employee.first_name AS "first name", employee.last_name 
    AS "last name", roles.title, department.department_name AS department, roles.salary, 
    concat(manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    LEFT JOIN roles
    ON employee.role_id = roles.id
    LEFT JOIN department
    ON roles.department_id = department.id
    LEFT JOIN employee manager
    ON manager.id = employee.manager_id`;
    db.query(sql, (err, dbRes) => {
        if (err) {
            console.log(err)
            return;
        }
        console.table(dbRes);
        startApp();
    });
};

function addRole() {
    db.query("select id as value, department_name as name from department", (err, department) => {
        if (err) console.log(err);
        prompt([
            {
                type: "input",
                name: "role_title",
                message: "Enter the title of the new role.",
            },
            {
                type: "input",
                name: "role_salary",
                message: "Enter the salary of the new role.",
            },
            {
                type: "list",
                name: "dept_id",
                message: "Which department does this role belong to?",
                choices: department,
            },
        ]).then(({ role_title, role_salary, dept_id }) => {
            db.query(
                "insert into roles (title, salary, department_id) values (?,?,?) ",
                [role_title, role_salary, dept_id],
                (err) => {
                    if (err) console.log(err);
                    console.log("The new role was successfully added.");
                    startApp();
                }
            );
        });
    });
};

function addDepartment() {
    db.query('SELECT department_name as department FROM department', (err, dbRes) => {
        if (err) console.log(err);
        prompt([
            {
                type: "input",
                name: "department_title",
                message: "What is the name of the department?"
            }
        ]).then(({ department_title }) => {
            db.query(
                "INSERT INTO department (department_name) VALUES (?)",
                [department_title],
                (err) => {
                    if (err) console.log(err);
                    console.log('Department was successfully added.');
                    startApp();
                }
            );
        });
    });
};

function addEmployee() {
    db.query("SELECT employee.id, employee.first_name, employee.last_name, roles.title FROM employee LEFT JOIN roles ON employee.role_id = roles.id", (err, employees) => {
        if (err) console.log(err);
        let choices = employees.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }));
        choices = [{ name: 'no manager', value: null }, ...choices]
        db.query('SELECT id, title FROM roles;', (err, roleRes) => {
            prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: "What is the employee's first name?"
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: "What is the employee's last name?"
                },
                {
                    type: 'list',
                    name: 'employee_role',
                    message: "What is the employee's role?",
                    choices: roleRes.map(role => ({ name: role.title, value: role.id })),
                },
                {
                    type: 'list',
                    name: 'employee_manager',
                    message: "Who is the employee's manager?",
                    choices: choices,
                }
            ]).then(({ first_name, last_name, employee_role, employee_manager }) => {
                db.query(
                    'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
                    [first_name, last_name, employee_role, employee_manager],
                    (err) => {
                        if (err) console.log(err);
                        console.log('Employee was successfully added.');
                        startApp();
                    }
                );
            });
        })
        
    });
}

function updateEmployee() {
    db.query('SELECT first_name AS name, last_name, id FROM employee;', (err, dbRes) => {
        if (err) console.log(err);
        db.query('SELECT id, title FROM roles;', (err, roleRes) => {
            if (err) console.log(err);
            prompt([
                {
                    type: 'list',
                    name: 'employee_list',
                    message: "Which employee's role would you like to update?",
                    choices: dbRes.map(employee => ({ name: employee.name, value: employee.id })),
                },
                {
                    type: 'list',
                    name: 'new_role',
                    message: 'Which role would you like to assign to the employee?',
                    choices: roleRes.map(role => ({ name: role.title, value: role.id })),
                },
            ]).then(({ employee_list, new_role }) => {
                db.query(
                    'UPDATE employee SET role_id = ? WHERE id = ?',
                    [new_role, employee_list],
                    (err) => {
                        if (err) console.log(err);
                        console.log("Employee's role was successfully updated");
                        startApp();
                    }
                );
            });
        });
    });
}

init();