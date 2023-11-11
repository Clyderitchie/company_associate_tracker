INSERT INTO department (department_name) 
VALUES 
('Engineering'), 
('Finance'), 
('Legal'), 
('Sales');

INSERT INTO roles (title, salary, department_id)
VALUES 
('Sales Lead', '100000', 4),
('Salesperson', '80000', 4),
('Lead Engineer', '150000', 1),
('Software Engineer', '120000', 1),
('Account Manager', '160000', 2),
('Accountant', '125000', 2),
('Legal Team Lead', '25000', 3),
('Lawyer', '190000', 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Clyde','Ritchie', 1, NULL),
('Val','Fry', 4, 1),
('Apollo','Smith', 2, NULL),
('Dylan','Miller', 3, NULL),
('Ed','Reed', 2, NULL),
('Conny','Francis', 2, 4),
('Andrew','Hicks', 4, NULL),
('Robert','David', 3, 5);