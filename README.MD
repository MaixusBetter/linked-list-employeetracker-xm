
# Employee Tracker

## Description
Employee Tracker is a command-line application designed to manage a company's employee database.

 Version: 1.0.0
 License: MIT

 Dependencies:
   - inquirer: ^9.1.4
   - pg: ^8.12.0
   - console.table: ^0.10.0

## Installation
To run Employee Tracker locally, follow these steps:
 
1. Clone the repository:
    \`\`\`bash
    git clone <repository-url>
    cd employee-tracker
    \`\`\`
 
2. Install dependencies:
    \`\`\`bash
    npm install
    \`\`\`
 
3. Set up your PostgreSQL database:
    - Ensure PostgreSQL is installed and running.
    - Create a database named \`employee-tracker\`.
    - Update database configuration in the \`index.js\` file if necessary.
 
4. Start the application:
    \`\`\`bash
    npm run start
    \`\`\`
    This will start the application and present you with the command-line interface.
 
## Usage
- Run the application using \`node index.js\`.
- Follow the prompts to:
  - View all departments
  - View all roles
  - View all employees
  - Add a department
  - Add a role
  - Add an employee
  - Update an employee role
- The application will display formatted tables and prompt for necessary inputs.

## Technologies Used
- Node.js
- PostgreSQL
- Inquirer (for command-line prompts)
- Console.table (for displaying formatted tables)

## Credits
- Author: Xavier Mendoza

## License
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the MIT License - see the LICENSE file for details.

