# FundX

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Repositories](#repositories)
4. [Instructions for Running the Project](#instructions-for-running-the-project)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Setting Up Environment Variables](#setting-up-environment-variables)
   - [Setting Up the Database](#setting-up-the-database)
   - [Starting the Server](#starting-the-server)
5. [Usage](#usage)
6. [Project Structure](#project-structure)
7. [Testing](#testing)
8. [Technologies Used](#technologies-used)
   - [Frontend](#frontend)
   - [Backend](#backend)
   - [Database](#database)
   - [API Development & Testing](#api-development--testing)
   - [Deployment](#deployment)
   - [Version Control](#version-control)
   - [UML Diagrams](#uml-diagrams)
   - [IDE](#ide)
9. [Contributors](#contributors)
10. [Contributing](#contributing)
11. [Contact](#contact)

## Introduction
The Funding Requests Management System is a web-based application that allows organizations to advertise their funding opportunities and manage the applications they receive. It supports various types of funding opportunities, including educational, business, and events.

## Features
- **Funding Opportunities Ads**: Enable organizations to advertise funding opportunities.
- **Applications**: Allow users to submit applications for funding opportunities.
- **Funding Review**: Enable fund managers to review and approve/reject applications.
- **Budgeting**: Provide tools for fund managers to manage the available funds.
- **Reporting**: Generate and display various reports on a dashboard, including funds usage over time and application data.
- **User Verification**: Implement user verification through a third-party identity provider with three roles: Applicants, Fund Managers, and Platform Admin.
- **User Management**: Allow admins to manage users, review and approve fund managers, block users, manage access, change permissions, etc.
- **Notifications**: Send relevant users notifications on updates to their applications.

## Repositories
This project is divided into two repositories to separate the frontend and backend components:

1. **Frontend Repository**: [Frontend Repository Link](https://github.com/Primeister/FundingRequest)
2. **Backend Repository**: [Backend Repository Link](https://github.com/Primeister/FundingRequest-Backend)

## Instructions for Running the Project

### Prerequisites
Before you begin, ensure you have met the following requirements:
- [Node.js](https://nodejs.org/) (version 14.x or higher)
- [npm](https://www.npmjs.com/) (version 6.x or higher)
- [SQLite3](https://www.sqlite.org/download.html)
- A code editor like [VS Code](https://code.visualstudio.com/)

### Installation
1. **Clone the Repositories**:
   ```sh
   git clone https://github.com/Primeister/FundingRequest.git
   git clone https://github.com/Primeister/FundReq.git
   ```
2. **Navigate to the Project Directories**:
   ```sh
   cd FundingRequest
   ```
   In a separate terminal:
   ```sh
   cd FundReq
   ```
3. **Install Dependencies**:
   In both project directories, run:
   ```sh
   npm install
   ```

### Setting Up Environment Variables
In each repository, create a `.env` file in the root directory and add the following environment variables:

For the frontend repository:
```plaintext
PORT=5000
```

For the backend repository:
```plaintext
PORT=3000
DATABASE_URL=https://fundreq.azurewebsites.net
```

### Setting Up the Database
1. **Initialize the Database**:
   Run the following commands in the backend repository to set up the SQLite3 database:
   ```sh
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

### Starting the Server
1. **Start the Backend Server**:
   In a terminal, navigate to the backend directory and run:
   ```sh
   npm install sqlite3
   npm start
   ```
   The backend server will be running at `http://localhost:3000`.

## Usage
1. **Open the Application**:
   Go to `http://localhost:5000` in your web browser.
2. **Create an Account**:
   Create an account to start submitting or managing funding requests.
3. **Explore Features**:
   - Submit applications
   - Review and manage funding opportunities
   - Track budget and generate reports

## Project Structure
### Frontend Repository
```
FundingRequest/
├── .github/workflows/
│   └── node.js.yml
├── Documents/
├── coverage/
├── images/
├── tests/
├── README.md
├── about.js
├── admin.html
├── admin.js
├── applicants.html
├── applicants.js
├── applications.html
├── applications.js
├── approve.js
├── category.js
├── dashboardResponsive.css
├── dashboardScript.js
├── dashboardStyle.css
├── form.css
├── form.html
├── form.js
├── fundManagers.js
├── fundingOpp.js
├── fundingReport.js
├── fundmanagers.html
├── funds.js
├── index.html
├── jest.config.js
├── main.js
├── manageApplicants.js
├── manageFunders.js
├── notifications.js
├── reporting.css
├── reporting.html
├── reporting.js
├── script.js
├── signIn.js
├── signUp.js
├── status.html
├── status.js
├── style.css
```

### Backend Repository
```
FundingRequest-Backend/
├── .github/workflows/
│   └── ci.yml
├── node_modules/
├── README.md
├── database.db
├── index.js
├── package-lock.json
├── package.json
├── server.js
```

## Testing
1. **Run Tests**:
   In both repositories, you can run:
   ```sh
   npm test
   ```
   This will run the automated test cases to ensure the application is functioning correctly.

## Technologies Used
### Frontend:
- HTML, CSS, JavaScript

### Backend:
- Node.js

### Database:
- SQLite3

### API Development & Testing:
- Thunder Client (VS Code extension)
- Postman

### Deployment:
- Microsoft Azure

### Version Control:
- GitHub

### UML Diagrams:
- draw.io

### IDE:
- Visual Studio Code

## Contributors
- Prince Dlomo
- Athini Mgagule
- Khumoetsile Marope
- Vutshila Mashimbyi
- Siphosakhe Mkhwanazi

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

## Contact
For any questions or feedback, feel free to contact any of the contributors:
- Prince Dlomo: [2332600@students.wits.ac.za]
- Athini Mgagule: [2549192@students.wits.ac.za]
- Khumoetsile Marope: [1884585@students.wits.ac.za]
- Vutshila Mashimbyi: [2562071@students.wits.ac.za]
- Siphosakhe Mkhwanazi: [2583003@students.wits.ac.za]
