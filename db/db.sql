-- SELECT employee.first_name, employee.last_name, manager.id AS manager,roles.id AS role FROM employee LEFT JOIN employee AS manager ON employee.manager_id = manager.id LEFT JOIN roles ON employee.role_id = roles.id;
function updateEmployeeRole() {
  db.query(
    "SELECT employee.id, employee.first_name, employee.last_name, roles.title FROM employee LEFT JOIN roles ON employee.role_id = roles.id",
    (err, employees) => {
      if (err) console.log(err);
      prompt([
        {
          type: 'list',
          name: 'employee',
          message: "Select the employee you want to update:",
          choices: employees.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
          })),
        },
        {
          type: 'input',
          name: 'newRole',
          message: "Enter the new role for the employee:",
        },
      ]).then(({ employee, newRole }) => {
        db.query(
          'UPDATE employee SET role_id = ? WHERE id = ?',
          [newRole, employee],
          (err) => {
            if (err) console.log(err);
            console.log('Employee role was successfully updated.');
            startApp();
          }
        );
      });
    }
  );
}

function addEmployee() {
    db.query("SELECT employee.id, employee.first_name, employee.last_name, roles.title FROM employee LEFT JOIN roles ON employee.role_id = roles.id", (err, employees) => {
        if (err) console.log(err);
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
                choices: employees.map(employee => ({ name: employee.title, value: employee.id })),
            },
            {
                type: 'list',
                name: 'employee_manager',
                message: "Who is the employee's manager?",
                choices: employees.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id })),
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
    });
}