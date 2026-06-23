const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { z } = require("zod");

const employees = [
  {
    id: 1,
    name: "John",
    salary: 50000,
    location: "Bangalore",
  },
];

const server = new McpServer({
  name: "employee-server",
  version: "1.0.0",
});

server.tool(
  "getEmployees",
  "Get all employees",
  {},
  async () => {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(employees, null, 2),
        },
      ],
    };
  }
);

server.tool(
  "createEmployee",
  "Create an employee",
  {
    name: z.string(),
    salary: z.number(),
    location: z.string(),
  },
  async ({ name, salary, location }) => {
    const employee = {
      id: employees.length + 1,
      name,
      salary,
      location,
    };

    employees.push(employee);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(employee, null, 2),
        },
      ],
    };
  }
);

server.tool(
  "updateEmployee",
  "Update an existing employee",
  {
    id: z.number(),
    name: z.string().optional(),
    salary: z.number().optional(),
    location: z.string().optional(),
  },
  async ({ id, name, salary, location }) => {
    const employee = employees.find((e) => e.id === id);

    if (!employee) {
      return {
        content: [
          {
            type: "text",
            text: `Employee with id ${id} not found`,
          },
        ],
      };
    }

    if (name !== undefined) employee.name = name;
    if (salary !== undefined) employee.salary = salary;
    if (location !== undefined) employee.location = location;

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(employee, null, 2),
        },
      ],
    };
  }
);

server.tool(
  "deleteEmployee",
  "Delete an employee",
  {
    id: z.number(),
  },
  async ({ id }) => {
    const index = employees.findIndex((e) => e.id === id);

    if (index === -1) {
      return {
        content: [
          {
            type: "text",
            text: `Employee with id ${id} not found`,
          },
        ],
      };
    }

    const deletedEmployee = employees.splice(index, 1)[0];

    return {
      content: [
        {
          type: "text",
          text: `Deleted employee:\n${JSON.stringify(
            deletedEmployee,
            null,
            2
          )}`,
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
   console.error("✅ MCP Server Started");
}

main().catch(console.error);