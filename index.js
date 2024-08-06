// Importing required modules
import inquirer from 'inquirer';
import pkg from 'pg';
import cTable from 'console.table';

// Destructuring Client from the pg module
const { Client } = pkg;

// Configuring the PostgreSQL client
const client = new Client({
    host: 'localhost',
    user: 'postgres', 
    password: '', 
    database: 'employee-tracker'
});

// Connecting to the PostgreSQL database
client.connect(err => {
    if (err) throw err;
    console.log('Connected to the database.');
    start();
});

// Function to start the inquirer prompt
const start = () => {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ]
    }).then(answer => {
        // Switch case to handle different actions
        switch (answer.action) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Exit':
                client.end();
                break;
        }
    });
};

// Function to view all departments
const viewDepartments = () => {
    client.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res.rows); // Display the result as a table
        start();
    });
};

// Function to view all roles
const viewRoles = () => {
    client.query(`SELECT role.id, role.title, role.salary, department.name AS department
                  FROM role
                  LEFT JOIN department ON role.department_id = department.id`, (err, res) => {
        if (err) throw err;
        console.table(res.rows); // Display the result as a table
        start();
    });
};

// Function to view all employees
const viewEmployees = () => {
    client.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
                  CONCAT(manager.first_name, ' ', manager.last_name) AS manager
                  FROM employee
                  LEFT JOIN role ON employee.role_id = role.id
                  LEFT JOIN department ON role.department_id = department.id
                  LEFT JOIN employee manager ON manager.id = employee.manager_id`, (err, res) => {
        if (err) throw err;
        console.table(res.rows); // Display the result as a table
        start();
    });
};

// Function to add a new department
const addDepartment = () => {
    inquirer.prompt({
        name: 'name',
        type: 'input',
        message: 'Enter the name of the department:'
    }).then(answer => {
        client.query('INSERT INTO department (name) VALUES ($1)', [answer.name], (err) => {
            if (err) throw err;
            console.log('Department added successfully.');
            start();
        });
    });
};

// Function to add a new role
const addRole = () => {
    client.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        const departments = res.rows;

        inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'Enter the title of the role:'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'Enter the salary for the role:'
            },
            {
                name: 'department_id',
                type: 'list',
                message: 'Select the department for the role:',
                choices: departments.map(department => ({
                    name: department.name,
                    value: department.id
                }))
            }
        ]).then(answers => {
            client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [answers.title, answers.salary, answers.department_id], (err) => {
                if (err) throw err;
                console.log('Role added successfully.');
                start();
            });
        });
    });
};

// Function to add a new employee
const addEmployee = () => {
    client.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        const roles = res.rows;

        client.query('SELECT * FROM employee', (err, res) => {
            if (err) throw err;
            const employees = res.rows;

            inquirer.prompt([
                {
                    name: 'first_name',
                    type: 'input',
                    message: 'Enter the first name of the employee:'
                },
                {
                    name: 'last_name',
                    type: 'input',
                    message: 'Enter the last name of the employee:'
                },
                {
                    name: 'role_id',
                    type: 'list',
                    message: 'Select the role for the employee:',
                    choices: roles.map(role => ({
                        name: role.title,
                        value: role.id
                    }))
                },
                {
                    name: 'manager_id',
                    type: 'list',
                    message: 'Select the manager for the employee:',
                    choices: [{ name: 'None', value: null }].concat(
                        employees.map(employee => ({
                            name: `${employee.first_name} ${employee.last_name}`,
                            value: employee.id
                        }))
                    )
                }
            ]).then(answers => {
                client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', 
                             [answers.first_name, answers.last_name, answers.role_id, answers.manager_id], (err) => {
                    if (err) throw err;
                    console.log('Employee added successfully.');
                    start();
                });
            });
        });
    });
};

// Function to update an employee's role
const updateEmployeeRole = () => {
    client.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        const employees = res.rows;

        client.query('SELECT * FROM role', (err, res) => {
            if (err) throw err;
            const roles = res.rows;

            inquirer.prompt([
                {
                    name: 'employee_id',
                    type: 'list',
                    message: 'Select the employee to update:',
                    choices: employees.map(employee => ({
                        name: `${employee.first_name} ${employee.last_name}`,
                        value: employee.id
                    }))
                },
                {
                    name: 'role_id',
                    type: 'list',
                    message: 'Select the new role for the employee:',
                    choices: roles.map(role => ({
                        name: role.title,
                        value: role.id
                    }))
                }
            ]).then(answers => {
                client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answers.role_id, answers.employee_id], (err) => {
                    if (err) throw err;
                    console.log('Employee role updated successfully.');
                    start();
                });
            });
        });
    });
};
