const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: 'localhost',
    database: 'employee_tracker_db',
    user: 'root',
    password: ''
}, console.log('Data successfully connected to db..'));

// GET: department
app.get('/api/company/departments', (req, res) => {
    db.query('SELECT * FROM department', (err, dbRes) => {
        if (err) {
            res.status(500).end()
        } else {
            res.status(200).json(dbRes)
        }
    })
});

// POST: department
app.post('/api/company/departments', (req, res) => {
    const { department_name } = req.body;
    db.query('INSERT INTO department (department_name) VALUES (?)', [department_name], (err, dbRes) => {
        if (err) {
            res.status(500).end();
        } else {
            res.status(200).json(dbRes);
        }
    })
});

// GET: role
app.get('/api/company/role', (req, res) => {
    db.query('SELECT * FROM role', (err, dbRes) => {
        if (err) {
            res.status(500).end()
        } else {
            res.status(200).json(dbRes)
        }
    })
});

// POST: role
app.post('/api/company/role', (req, res) => {
    const { title, salary } = req.body;
    db.query('INSERT INTO role (title, salary) VALUES (?, ?)', [title, salary], (err, dbRes) => {
        if (err) {
            res.status(500).end();
        } else {
            res.status(200).json(dbRes);
        }
    })
});

// GET: employee
app.get('/api/company/employee', (req, res) => {
    db.query('SELECT * FROM employee', (err, dbRes) => {
        if (err) {
            res.status(500).end()
        } else {
            res.status(200).json(dbRes)
        }
    })
});

// POST: employee
app.post('/api/company/employee', (req, res) => {
    const { first_name, last_name } = req.body;
    db.query('INSERT INTO employee (first_name, last_name) VALUES (?, ?)', [first_name, last_name], (err, dbRes) => {
        if (err) {
            res.status(500).end();
        } else {
            res.status(200).json(dbRes);
        }
    })
})


app.listen(3001, () => console.log('App now running on http://localhost:3001'));