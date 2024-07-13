const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Employees } = require('../utils/database');

exports.register = async (req, res) => {
  try {
    const { idNumber, password } = req.body;

    if (!idNumber || !password) {
      return res.status(400).json({ error: 'ID Number and Password are required' });
    }

    const foundEmp = await Employees.findOne({ where: { id_number: idNumber } });
    if (foundEmp) {
      return res.status(409).json({ error: 'Employee already exists. Please, log in.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newEmp = { id_number: idNumber, password: hashedPassword };
    const createdEmp = await Employees.create(newEmp);
    console.log('New employee created successfully');

    const token = jwt.sign({ employee_id: createdEmp.employee_id }, process.env.SECRET_KEY);

    res.status(201).json({ token: token, empId: createdEmp.employee_id, message: 'Employee registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { idNumber, password } = req.body;

    if (!idNumber || !password) {
      return res.status(400).json({ error: 'ID Number and Password are required' });
    }

    const foundEmp = await Employees.findOne({ where: { id_number: idNumber } });
    if (!foundEmp) {
      return res.status(401).json({ error: 'Wrong ID Number or Password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, foundEmp.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Wrong ID Number or Password.' });
    }

    const token = jwt.sign({ employee_id: foundEmp.employee_id }, process.env.SECRET_KEY);

    res.status(201).json({ token: token, empId: foundEmp.employee_id });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
