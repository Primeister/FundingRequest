# FundX

## Introduction
Several organizations, such as national lotteries and large companies, contribute to society by funding various initiatives and individuals. These funding opportunities can range from small event sponsorships to substantial grants for long-term projects like bursaries and research funds. Some funding initiatives also offer direct benefits to organizations, such as marketing exposure or exclusive rights.

## Objectives
The project will be developed using Agile methodology, incorporating Continuous Integration and Continuous Deployment (CI/CD) principles, and following a test-driven approach. The objective is to design, develop, and operationalize a publicly available, web-based application that fulfills the following requirements:

## Overview of Features
- **Funding Opportunities Ads**: Enable organizations to advertise funding opportunities.
- **Applications**: Allow users to submit applications for funding opportunities.
- **Funding Review**: Enable fund managers to review and approve/reject applications.
- **Budgeting**: Provide tools for fund managers to manage the available funds.
- **Reporting**: Generate and display various reports on a dashboard, including funds usage over time and application data.
- **User Verification**: Implement user verification through a third-party identity provider with three roles: Applicants, Fund Managers, and Platform Admin.
- **User Management**: Allow admins to manage users, review and approve fund managers, block users, manage access, change permissions, etc.
- **Notifications**: Send relevant users notifications on updates to their applications.
- **Bonus**: Allow users to upload documents and scan them to pre-populate forms.

## Detailed Requirements
| Requirement                    | Extra info/limitations                                                  |
|--------------------------------|-------------------------------------------------------------------------|
| **User Verification**          | - Use a 3rd party identity provider.<br>- Implement 3 roles: Applicants, Fund Managers, and Platform Admin. |
| **User Management**            | - Admins should be able to manage users, review and approve fund managers, block users, manage access, change permissions, etc. |
| **Funding Opportunities Ads & Review** | - Once approved, fund managers should be able to advertise funding opportunities.<br>- Fund managers should be able to review and approve/reject applications. |
| **Applications**               | - The public should be able to create accounts, submit applications, upload and view attachments, follow up on applications, and see status updates. |
| **Budgeting**                  | - Fund managers should be able to see how much money is in the system and manage it accordingly. |
| **Reporting**                  | - At least 3 views of reports should be available on a dashboard:<br>  1. Funds in the system and usage over time.<br>  2. Applications data.<br>  3. Custom view.<br>- Reports should be exportable as CSV or PDF. |
| **Notifications**              | - Relevant users should receive notifications on updates to their applications. |

## Instructions for Running the Project
### Prerequisites
Before you begin, ensure you have met the following requirements:
- [Node.js](https://nodejs.org/) (version 14.x or higher)
- [npm](https://www.npmjs.com/) (version 6.x or higher)
- [SQLite3](https://www.sqlite.org/download.html)
- A code editor like [VS Code](https://code.visualstudio.com/)

### Installation
1. **Clone the Repository**:
   ```sh
   git clone https://github.com/Primeister/FundingRequest.git
   ```
2. **Navigate to the Project Directory**:
   ```sh
   cd FundingRequest
   ```
3. **Install Dependencies**:
   ```sh
   npm install
   ```

### Setting Up Environment Variables
Create a `.env` file in the root directory and add the following environment variables:
```plaintext
PORT=3000
DATABASE_URL=sqlite://./data/database.sqlite
JWT_SECRET=your_jwt_secret
```

### Setting Up the Database
1. **Initialize the Database**:
   Run the following commands to set up the SQLite3 database:
   ```sh
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

### Starting the Server
1. **Start the Application**:
   ```sh
   npm start
   ```
   The application will be running at `http://localhost:3000`.

## Usage
1. **Open the Application**:
   Go to `http://localhost:3000` in your web browser.
2. **Create an Account**:
   Create an account to start submitting or managing funding requests.
3. **Explore Features**:
   - Submit applications
   - Review and manage funding opportunities
   - Track budget and generate reports

## Project Structure
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

## Testing
1. **Run Tests**:
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

1.Fork the repository.
2.Create a new branch (git checkout -b feature-branch).
3.Make your changes and commit them (git commit -m 'Add new feature').
4.Push to the branch (git push origin feature-branch).
5.Open a Pull Request.

## Contact
For any questions or feedback, feel free to contact any of the contributors:
- Prince Dlomo: [princehumantorch57@gmail.com]
- Athini Mgagule: [athinimgagule1@students.wits.ac.za]
- Khumoetsile Marope: [khumoetsilemarope1@students.wits.ac.za]
- Vutshila Mashimbyi: [vutshilamashimbyi1@students.wits.ac.za]
- Siphosakhe Mkhwanazi: [siphosakhemkhwanazi1@students.wits.ac.za]
