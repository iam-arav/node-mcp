const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());


let employees = [
  {
    id: 1,
    name: "John Doe",
    salary: 50000,
    location: "Bangalore"
  },
  {
    id: 2,
    name: "Jane Smith",
    salary: 70000,
    location: "Chennai"
  }
];


app.get("/employees", (req, res) => {
  res.status(200).json({
    success: true,
    data: employees
  });
});


app.get("/employees/:id", (req, res) => {
  const id = Number(req.params.id);

  const employee = employees.find(emp => emp.id === id);

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: "Employee not found"
    });
  }

  res.status(200).json({
    success: true,
    data: employee
  });
});


app.post("/employees", (req, res) => {
  const { name, salary, location } = req.body;

  if (!name || !salary || !location) {
    return res.status(400).json({
      success: false,
      message: "name, salary and location are required"
    });
  }

  const newEmployee = {
    id: employees.length
      ? Math.max(...employees.map(emp => emp.id)) + 1
      : 1,
    name,
    salary,
    location
  };

  employees.push(newEmployee);

  res.status(201).json({
    success: true,
    message: "Employee created successfully",
    data: newEmployee
  });
});

app.put("/employees/:id", (req, res) => {
  const id = Number(req.params.id);

  const employeeIndex = employees.findIndex(
    emp => emp.id === id
  );

  if (employeeIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Employee not found"
    });
  }

  const { name, salary, location } = req.body;

  employees[employeeIndex] = {
    ...employees[employeeIndex],
    name,
    salary,
    location
  };

  res.status(200).json({
    success: true,
    message: "Employee updated successfully",
    data: employees[employeeIndex]
  });
});


app.patch("/employees/:id", (req, res) => {
  const id = Number(req.params.id);

  const employee = employees.find(
    emp => emp.id === id
  );

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: "Employee not found"
    });
  }

  Object.assign(employee, req.body);

  res.status(200).json({
    success: true,
    message: "Employee updated successfully",
    data: employee
  });
});


app.delete("/employees/:id", (req, res) => {
  const id = Number(req.params.id);

  const employee = employees.find(
    emp => emp.id === id
  );

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: "Employee not found"
    });
  }

  employees = employees.filter(
    emp => emp.id !== id
  );

  res.status(200).json({
    success: true,
    message: "Employee deleted successfully"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});